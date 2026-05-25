package edu.cit.pacana.brewbatch.features.orders;

import edu.cit.pacana.brewbatch.features.inventory.InventoryItem;
import edu.cit.pacana.brewbatch.features.inventory.InventoryItemRepository;
import edu.cit.pacana.brewbatch.features.notifications.NotificationService;
import edu.cit.pacana.brewbatch.features.users.User;
import edu.cit.pacana.brewbatch.features.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class OrderService {

    @Autowired private PurchaseOrderRepository orderRepository;
    @Autowired private NotificationService notificationService;
    @Autowired private UserRepository userRepository;
    @Autowired private InventoryItemRepository inventoryRepository;

    // ─── Queries ──────────────────────────────────────────────────────────

    public List<PurchaseOrder> getAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<PurchaseOrder> getBySupplierEmail(String email) {
        List<PurchaseOrder> byEmail = orderRepository.findBySupplierEmailOrderByCreatedAtDesc(email);
        List<PurchaseOrder> byName  = orderRepository.findBySupplierAndSupplierEmailIsNullOrderByCreatedAtDesc(email);
        Set<Long> seen = new HashSet<>();
        List<PurchaseOrder> result = new ArrayList<>();
        for (PurchaseOrder o : byEmail) { if (seen.add(o.getId())) result.add(o); }
        for (PurchaseOrder o : byName)  { if (seen.add(o.getId())) result.add(o); }
        return result;
    }

    // ─── Create ───────────────────────────────────────────────────────────

    @Transactional
    public PurchaseOrder create(OrderRequest req) {
        PurchaseOrder o = new PurchaseOrder();
        o.setSupplier(req.getSupplier());
        o.setSupplierEmail(req.getSupplierEmail());
        o.setItem(req.getItem());
        o.setQuantity(req.getQuantity());
        o.setTotalCost(req.getTotalCost());
        o.setStatus(PurchaseOrder.STATUS_PENDING);
        PurchaseOrder saved = orderRepository.save(o);

        // Notify the assigned supplier
        if (req.getSupplierEmail() != null) {
            userRepository.findByEmail(req.getSupplierEmail()).ifPresent(supplier ->
                notificationService.create(supplier.getId(), "ORDER",
                    "📦 New Order Received",
                    "New order for \"" + req.getItem() + "\" (Qty: " + req.getQuantity() + ") has been placed.")
            );
        }
        return saved;
    }

    // ─── Update ───────────────────────────────────────────────────────────

    @Transactional
    public PurchaseOrder update(Long id, OrderRequest req) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setSupplier(req.getSupplier());
        o.setSupplierEmail(req.getSupplierEmail());
        o.setItem(req.getItem());
        o.setQuantity(req.getQuantity());
        o.setTotalCost(req.getTotalCost());
        if (req.getStatus() != null) o.setStatus(req.getStatus());
        return orderRepository.save(o);
    }

    // ─── Status Transitions ───────────────────────────────────────────────

    @Transactional
    public PurchaseOrder approve(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setStatus(PurchaseOrder.STATUS_APPROVED);
        PurchaseOrder saved = orderRepository.save(o);
        notifyAllAdminsAndBaristas("✅ Order Approved",
            "Order #" + id + " for \"" + o.getItem() + "\" from " + o.getSupplier() + " has been approved.");
        return saved;
    }

    @Transactional
    public PurchaseOrder reject(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setStatus(PurchaseOrder.STATUS_REJECTED);
        PurchaseOrder saved = orderRepository.save(o);
        notifyAllAdminsAndBaristas("❌ Order Rejected",
            "Order #" + id + " for \"" + o.getItem() + "\" from " + o.getSupplier() + " has been rejected.");
        return saved;
    }

    @Transactional
    public PurchaseOrder markInTransit(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setStatus(PurchaseOrder.STATUS_IN_TRANSIT);
        PurchaseOrder saved = orderRepository.save(o);
        notifyAllAdminsAndBaristas("🚚 Order In Transit",
            "Order #" + id + " for \"" + o.getItem() + "\" is now in transit.");
        return saved;
    }

    /**
     * Supplier marks an order as DELIVERED.
     * Auto-credits inventory stock for the delivered item.
     * Guards against duplicate updates with inventoryUpdated flag.
     */
    @Transactional
    public PurchaseOrder markDelivered(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();

        if (PurchaseOrder.STATUS_DELIVERED.equals(o.getStatus())) {
            throw new RuntimeException("Order #" + id + " is already marked as delivered.");
        }

        o.setStatus(PurchaseOrder.STATUS_DELIVERED);

        // Auto-update inventory — prevent duplicates
        if (!o.isInventoryUpdated()) {
            creditInventory(o);
            o.setInventoryUpdated(true);
        }

        PurchaseOrder saved = orderRepository.save(o);

        // Notify all admins and baristas
        notifyAllAdminsAndBaristas("📬 Order Delivered",
            "Order #" + id + " for \"" + o.getItem() + "\" (Qty: " + o.getQuantity()
                + ") has been delivered by " + o.getSupplier() + ". Inventory has been updated.");

        return saved;
    }

    @Transactional
    public PurchaseOrder cancel(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setStatus(PurchaseOrder.STATUS_CANCELLED);
        PurchaseOrder saved = orderRepository.save(o);
        notifyAllAdminsAndBaristas("🚫 Order Cancelled",
            "Order #" + id + " for \"" + o.getItem() + "\" has been cancelled.");
        return saved;
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    /**
     * Find matching inventory item by name (case-insensitive) and add quantity.
     * If no match is found, do nothing — admin can manually create the item.
     */
    private void creditInventory(PurchaseOrder order) {
        if (order.getItem() == null || order.getQuantity() == null) return;
        Optional<InventoryItem> match = inventoryRepository.findByIsArchivedFalse().stream()
            .filter(item -> item.getName().equalsIgnoreCase(order.getItem().trim()))
            .findFirst();
        match.ifPresent(item -> {
            item.setCurrentStock(item.getCurrentStock() + order.getQuantity().doubleValue());
            inventoryRepository.save(item);
        });
    }

    /** Notify all ADMIN and BARISTA users */
    private void notifyAllAdminsAndBaristas(String title, String body) {
        userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN || u.getRole() == User.Role.BARISTA)
            .forEach(u -> notificationService.create(u.getId(), "ORDER", title, body));
    }
}