package edu.cit.pacana.brewbatch.features.invoices;

import edu.cit.pacana.brewbatch.shared.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    private Map<String, Object> success(Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("error", null);
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    @GetMapping
    public ResponseEntity<?> getAll(@AuthenticationPrincipal UserDetailsImpl user) {
        if ("SUPPLIER".equals(user.getRole())) {
            return ResponseEntity.ok(success(invoiceService.getBySupplier(user.getId())));
        }
        return ResponseEntity.ok(success(invoiceService.getAll()));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody InvoiceRequest req) {
        return ResponseEntity.status(201).body(success(invoiceService.create(req)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(success(invoiceService.approve(id)));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> pay(@PathVariable Long id) {
        return ResponseEntity.ok(success(invoiceService.pay(id)));
    }
}
