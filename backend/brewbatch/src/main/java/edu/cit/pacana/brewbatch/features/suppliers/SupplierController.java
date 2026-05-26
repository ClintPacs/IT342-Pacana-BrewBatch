package edu.cit.pacana.brewbatch.features.suppliers;

import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(success(supplierService.getAll()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return supplierService.getByName(user.getUsername())
                .map(s -> ResponseEntity.ok(success(s)))
                .orElse(ResponseEntity.status(404).body(success(null)));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SupplierRequest req) {
        return ResponseEntity.status(201).body(success(supplierService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SupplierRequest req) {
        return ResponseEntity.ok(success(supplierService.update(id, req)));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody SupplierRequest req) {
        return supplierService.getByName(user.getUsername())
                .map(s -> ResponseEntity.ok(success(supplierService.update(s.getId(), req))))
                .orElse(ResponseEntity.status(404).body(success(null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archive(@PathVariable Long id) {
        supplierService.archive(id);
        return ResponseEntity.ok(success(Map.of("message", "Supplier archived")));
    }
}