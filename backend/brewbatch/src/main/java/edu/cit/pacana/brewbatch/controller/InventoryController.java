package edu.cit.pacana.brewbatch.controller;

import edu.cit.pacana.brewbatch.dto.InventoryItemRequest;
import edu.cit.pacana.brewbatch.model.InventoryItem;
import edu.cit.pacana.brewbatch.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    private Map<String, Object> error(String code, String message) {
        Map<String, Object> res = new HashMap<>();
        Map<String, String> err = new HashMap<>();
        err.put("code", code);
        err.put("message", message);
        res.put("success", false);
        res.put("data", null);
        res.put("error", err);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<InventoryItem> items;
        if (search != null && !search.isEmpty()) {
            items = inventoryService.search(search);
        } else if (category != null && !category.isEmpty()) {
            items = inventoryService.filterByCategory(category);
        } else {
            items = inventoryService.getAll();
        }
        return ResponseEntity.ok(success(items));
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getLowStock() {
        return ResponseEntity.ok(success(inventoryService.getLowStock()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return inventoryService.getById(id)
                .map(item -> ResponseEntity.ok(success(item)))
                .orElse(ResponseEntity.status(404).body(error("DB-001", "Item not found")));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody InventoryItemRequest request) {
        InventoryItem item = inventoryService.create(request);
        return ResponseEntity.status(201).body(success(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody InventoryItemRequest request) {
        return inventoryService.update(id, request)
                .map(item -> ResponseEntity.ok(success(item)))
                .orElse(ResponseEntity.status(404).body(error("DB-001", "Item not found")));
    }

    @PutMapping("/{id}/threshold")
    public ResponseEntity<?> updateThreshold(@PathVariable Long id,
                                             @RequestBody Map<String, Double> body) {
        Double threshold = body.get("reorderThreshold");
        return inventoryService.updateThreshold(id, threshold)
                .map(item -> ResponseEntity.ok(success(item)))
                .orElse(ResponseEntity.status(404).body(error("DB-001", "Item not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archive(@PathVariable Long id) {
        return inventoryService.archive(id)
                .map(item -> {
                    Map<String, String> msg = new HashMap<>();
                    msg.put("message", "Item archived successfully");
                    return ResponseEntity.ok(success(msg));
                })
                .orElse(ResponseEntity.status(404).body(error("DB-001", "Item not found")));
    }
}