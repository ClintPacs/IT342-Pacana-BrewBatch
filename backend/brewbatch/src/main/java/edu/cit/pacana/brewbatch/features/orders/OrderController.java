package edu.cit.pacana.brewbatch.features.orders;

import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    // ─── Admin / Barista ─────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(success(orderService.getAll()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrderRequest req) {
        return ResponseEntity.status(201).body(success(orderService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OrderRequest req) {
        return ResponseEntity.ok(success(orderService.update(id, req)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.cancel(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.ok(success(Map.of("message", "Order deleted")));
    }

    // ─── Supplier endpoints ───────────────────────────────────────────────

    /** Supplier: view only their assigned orders */
    @GetMapping("/supplier")
    public ResponseEntity<?> getSupplierOrders(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(success(orderService.getBySupplierEmail(user.getEmail())));
    }

    /** Supplier: approve / confirm order */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.approve(id)));
    }

    /** Supplier: reject order */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.reject(id)));
    }

    /** Supplier: mark order as in-transit (shipped) */
    @PutMapping("/{id}/transit")
    public ResponseEntity<?> transit(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.markInTransit(id)));
    }

    /** Supplier: mark as delivered — triggers inventory auto-update */
    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliver(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.markDelivered(id)));
    }

    // Legacy aliases
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.approve(id)));
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<?> receive(@PathVariable Long id) {
        return ResponseEntity.ok(success(orderService.markDelivered(id)));
    }
}