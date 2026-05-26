package edu.cit.pacana.brewbatch.features.orders;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    public static final String STATUS_PENDING    = "PENDING";
    public static final String STATUS_APPROVED   = "APPROVED";
    public static final String STATUS_REJECTED   = "REJECTED";
    public static final String STATUS_IN_TRANSIT = "IN_TRANSIT";
    public static final String STATUS_DELIVERED  = "DELIVERED";
    public static final String STATUS_CANCELLED  = "CANCELLED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplier;
    private String supplierEmail;
    private String item;
    private Integer quantity;
    private Double totalCost;
    private String status = STATUS_PENDING;

    /** Prevent double delivery — set to true once inventory has been updated */
    @Column(name = "inventory_updated", nullable = false)
    private boolean inventoryUpdated = false;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    protected void onCreate() { createdAt = Instant.now(); }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSupplier() { return supplier; }
    public void setSupplier(String s) { this.supplier = s; }
    public String getSupplierEmail() { return supplierEmail; }
    public void setSupplierEmail(String e) { this.supplierEmail = e; }
    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isInventoryUpdated() { return inventoryUpdated; }
    public void setInventoryUpdated(boolean inventoryUpdated) { this.inventoryUpdated = inventoryUpdated; }
    public Instant getCreatedAt() { return createdAt; }
}