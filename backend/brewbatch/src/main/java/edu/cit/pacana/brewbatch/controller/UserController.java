package edu.cit.pacana.brewbatch.controller;

import edu.cit.pacana.brewbatch.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @GetMapping("/me")
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
}