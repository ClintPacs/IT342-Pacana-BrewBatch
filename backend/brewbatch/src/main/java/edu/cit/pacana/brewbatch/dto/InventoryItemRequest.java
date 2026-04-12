package edu.cit.pacana.brewbatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class InventoryItemRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Current stock is required")
    @Positive(message = "Stock must be positive")
    private Double currentStock;

    @NotNull(message = "Reorder threshold is required")
    @Positive(message = "Threshold must be positive")
    private Double reorderThreshold;

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
}