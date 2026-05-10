package edu.cit.pacana.brewbatch.features.suppliers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(Map.of("data", supplierService.getAll()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SupplierRequest req) {
        return ResponseEntity.ok(Map.of("data", supplierService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SupplierRequest req) {
        return ResponseEntity.ok(Map.of("data", supplierService.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archive(@PathVariable Long id) {
        supplierService.archive(id);
        return ResponseEntity.ok(Map.of("message", "Supplier archived"));
    }
}