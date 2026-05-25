package edu.cit.pacana.brewbatch.features.invoices;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    private String notes;

    @Column(nullable = false)
    private String status = "SUBMITTED";

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters
    public Long getId() { return id; }
    public Long getSupplierId() { return supplierId; }
    public Long getOrderId() { return orderId; }
    public Double getAmount() { return amount; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public String getNotes() { return notes; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setStatus(String status) { this.status = status; }
}
