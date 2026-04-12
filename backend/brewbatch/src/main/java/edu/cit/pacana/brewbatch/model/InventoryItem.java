package edu.cit.pacana.brewbatch.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String unit;

    @Column(name = "current_stock", nullable = false)
    private Double currentStock;

    @Column(name = "reorder_threshold", nullable = false)
    private Double reorderThreshold;

    @Column(name = "is_archived", nullable = false)
    private Boolean isArchived = false;

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

    // Computed field
    public Boolean getIsLowStock() {
        return currentStock <= reorderThreshold;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Double getCurrentStock() { return currentStock; }
    public void setCurrentStock(Double currentStock) { this.currentStock = currentStock; }
    public Double getReorderThreshold() { return reorderThreshold; }
    public void setReorderThreshold(Double reorderThreshold) { this.reorderThreshold = reorderThreshold; }
    public Boolean getIsArchived() { return isArchived; }
    public void setIsArchived(Boolean isArchived) { this.isArchived = isArchived; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}