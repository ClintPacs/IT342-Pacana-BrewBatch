package edu.cit.pacana.brewbatch.features.users;

import edu.cit.pacana.brewbatch.features.suppliers.SupplierRepository;
import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    // Current user info
    @GetMapping("/api/user/me")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", userDetails.getId());
        data.put("username", userDetails.getUsername());
        data.put("email", userDetails.getEmail());
        data.put("fullName", userDetails.getFullName());
        data.put("role", userDetails.getRole());
        return ResponseEntity.ok(success(data));
    }

    // Admin endpoints
    @GetMapping("/api/users")
    public ResponseEntity<?> getAll() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(success(users));
    }

    @PostMapping("/api/users")
    public ResponseEntity<?> create(@RequestBody UserRequest req) {
        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRole(User.Role.valueOf(req.getRole() != null ? req.getRole() : "BARISTA"));
        u.setPasswordHash(passwordEncoder.encode("default123"));
        return ResponseEntity.status(201).body(success(userRepository.save(u)));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserRequest req) {
        User u = userRepository.findById(id).orElseThrow();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRole(User.Role.valueOf(req.getRole() != null ? req.getRole() : "BARISTA"));
        return ResponseEntity.ok(success(userRepository.save(u)));
    }

    @PutMapping("/api/users/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        u.setActive(!u.isActive());
        return ResponseEntity.ok(success(userRepository.save(u)));
    }

    /**
     * Delete a user. If the user is a SUPPLIER, also delete their Supplier record
     * (matched by email) so they disappear from the Suppliers tab.
     */
    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();

        // Cascade: remove associated Supplier record for SUPPLIER users
        if (u.getRole() == User.Role.SUPPLIER) {
            supplierRepository.findByEmail(u.getEmail())
                    .ifPresent(supplier -> supplierRepository.delete(supplier));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(success(Map.of("message", "User deleted")));
    }
}