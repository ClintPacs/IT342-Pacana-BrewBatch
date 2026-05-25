package edu.cit.pacana.brewbatch.features.notifications;

import edu.cit.pacana.brewbatch.features.users.User;
import edu.cit.pacana.brewbatch.features.users.UserRepository;
import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                   UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", false);
        res.put("data", null);
        res.put("error", msg);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    /** Get unread notifications for current user */
    @GetMapping("/me")
    public ResponseEntity<?> getMyNotifications(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(success(notificationService.getUnread(user.getId())));
    }

    /** Get ALL notifications for current user (for Alerts tab) */
    @GetMapping("/all")
    public ResponseEntity<?> getAllMyNotifications(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(success(notificationService.getAllForUser(user.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(success(notificationService.markRead(id)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal UserDetailsImpl user) {
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok(success(Map.of("message", "All notifications marked as read")));
    }

    /**
     * Send a message to a user by their email.
     * POST /api/notifications/send
     * Body: { "email": "...", "subject": "...", "message": "..." }
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal UserDetailsImpl sender,
            @RequestBody Map<String, String> body) {

        String email = body.get("email");
        String subject = body.get("subject");
        String message = body.get("message");

        if (email == null || subject == null || message == null) {
            return ResponseEntity.badRequest().body(error("email, subject, and message are required"));
        }

        Optional<User> recipientOpt = userRepository.findByEmail(email);
        if (recipientOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(error("No user found with that email"));
        }

        String senderName = sender.getFullName() != null ? sender.getFullName() : sender.getUsername();
        String fullBody = "From: " + senderName + " <" + sender.getEmail() + ">\n\n" + message;

        Notification notification = notificationService.create(
                recipientOpt.get().getId(), "MESSAGE", subject, fullBody);

        return ResponseEntity.ok(success(notification));
    }

    /**
     * Reply to a message — sends notification back to all ADMIN users.
     * POST /api/notifications/reply
     * Body: { "subject": "...", "message": "..." }
     */
    @PostMapping("/reply")
    public ResponseEntity<?> replyToAdmin(
            @AuthenticationPrincipal UserDetailsImpl sender,
            @RequestBody Map<String, String> body) {

        String subject = body.get("subject");
        String message = body.get("message");
        if (subject == null || message == null) {
            return ResponseEntity.badRequest().body(error("subject and message are required"));
        }

        String senderName = sender.getFullName() != null ? sender.getFullName() : sender.getUsername();
        String fullBody = "Reply from: " + senderName + " <" + sender.getEmail() + ">\n\n" + message;

        // Send to all ADMIN users
        userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN)
            .forEach(admin -> notificationService.create(admin.getId(), "MESSAGE", "Re: " + subject, fullBody));

        return ResponseEntity.ok(success(Map.of("message", "Reply sent to admin")));
    }
}
