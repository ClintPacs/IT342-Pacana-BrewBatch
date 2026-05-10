package edu.cit.pacana.brewbatch.controller;

import edu.cit.pacana.brewbatch.dto.OrderRequest;
import edu.cit.pacana.brewbatch.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(Map.of("data", orderService.getAll()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrderRequest req) {
        return ResponseEntity.ok(Map.of("data", orderService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OrderRequest req) {
        return ResponseEntity.ok(Map.of("data", orderService.update(id, req)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("data", orderService.cancel(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Order deleted"));
    }
}