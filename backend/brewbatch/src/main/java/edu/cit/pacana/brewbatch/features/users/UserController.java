package edu.cit.pacana.brewbatch.features.users;

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
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Existing endpoint — keep as is
    @GetMapping("/api/user/me")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        data.put("id", userDetails.getId());
        data.put("username", userDetails.getUsername());
        data.put("email", userDetails.getEmail());
        data.put("fullName", userDetails.getFullName());
        data.put("role", userDetails.getRole());
        response.put("success", true);
        response.put("data", data);
        response.put("error", null);
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    // Admin endpoints
    @GetMapping("/api/users")
    public ResponseEntity<?> getAll() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(Map.of("data", users));
    }

    @PostMapping("/api/users")
    public ResponseEntity<?> create(@RequestBody UserRequest req) {
        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRole(User.Role.valueOf(req.getRole() != null ? req.getRole() : "BARISTA"));
        u.setPasswordHash(passwordEncoder.encode("default123"));
        return ResponseEntity.ok(Map.of("data", userRepository.save(u)));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserRequest req) {
        User u = userRepository.findById(id).orElseThrow();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRole(User.Role.valueOf(req.getRole() != null ? req.getRole() : "BARISTA"));
        return ResponseEntity.ok(Map.of("data", userRepository.save(u)));
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }
}