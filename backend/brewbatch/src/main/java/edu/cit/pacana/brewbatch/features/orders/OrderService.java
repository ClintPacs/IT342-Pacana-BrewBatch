package edu.cit.pacana.brewbatch.features.orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private PurchaseOrderRepository orderRepository;

    public List<PurchaseOrder> getAll() {
        return orderRepository.findAll();
    }

    public PurchaseOrder create(OrderRequest req) {
        PurchaseOrder o = new PurchaseOrder();
        o.setSupplier(req.getSupplier());
        o.setItem(req.getItem());
        o.setQuantity(req.getQuantity());
        o.setTotalCost(req.getTotalCost());
        o.setStatus(req.getStatus() != null ? req.getStatus() : "PENDING");
        return orderRepository.save(o);
    }

    public PurchaseOrder update(Long id, OrderRequest req) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setSupplier(req.getSupplier());
        o.setItem(req.getItem());
        o.setQuantity(req.getQuantity());
        o.setTotalCost(req.getTotalCost());
        o.setStatus(req.getStatus());
        return orderRepository.save(o);
    }

    public PurchaseOrder cancel(Long id) {
        PurchaseOrder o = orderRepository.findById(id).orElseThrow();
        o.setStatus("CANCELLED");
        return orderRepository.save(o);
    }

    // NEW
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}