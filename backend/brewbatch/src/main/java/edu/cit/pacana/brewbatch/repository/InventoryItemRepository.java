package edu.cit.pacana.brewbatch.repository;

import edu.cit.pacana.brewbatch.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findByIsArchivedFalse();

    List<InventoryItem> findByIsArchivedFalseAndNameContainingIgnoreCase(String name);

    List<InventoryItem> findByIsArchivedFalseAndCategoryIgnoreCase(String category);

    @Query("SELECT i FROM InventoryItem i WHERE i.isArchived = false AND i.currentStock <= i.reorderThreshold")
    List<InventoryItem> findLowStockItems();
}