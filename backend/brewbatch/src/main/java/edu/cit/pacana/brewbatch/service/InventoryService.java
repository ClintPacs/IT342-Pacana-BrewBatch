package edu.cit.pacana.brewbatch.service;

import edu.cit.pacana.brewbatch.dto.InventoryItemRequest;
import edu.cit.pacana.brewbatch.model.InventoryItem;
import edu.cit.pacana.brewbatch.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryItemRepository repo;

    public InventoryService(InventoryItemRepository repo) {
        this.repo = repo;
    }

    public List<InventoryItem> getAll() {
        return repo.findByIsArchivedFalse();
    }

    public Optional<InventoryItem> getById(Long id) {
        return repo.findById(id);
    }

    public List<InventoryItem> getLowStock() {
        return repo.findLowStockItems();
    }

    public List<InventoryItem> search(String name) {
        return repo.findByIsArchivedFalseAndNameContainingIgnoreCase(name);
    }

    public List<InventoryItem> filterByCategory(String category) {
        return repo.findByIsArchivedFalseAndCategoryIgnoreCase(category);
    }

    public InventoryItem create(InventoryItemRequest request) {
        InventoryItem item = new InventoryItem();
        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setUnit(request.getUnit());
        item.setCurrentStock(request.getCurrentStock());
        item.setReorderThreshold(request.getReorderThreshold());
        return repo.save(item);
    }

    public Optional<InventoryItem> update(Long id, InventoryItemRequest request) {
        return repo.findById(id).map(item -> {
            item.setName(request.getName());
            item.setCategory(request.getCategory());
            item.setUnit(request.getUnit());
            item.setCurrentStock(request.getCurrentStock());
            item.setReorderThreshold(request.getReorderThreshold());
            return repo.save(item);
        });
    }

    public Optional<InventoryItem> updateThreshold(Long id, Double threshold) {
        return repo.findById(id).map(item -> {
            item.setReorderThreshold(threshold);
            return repo.save(item);
        });
    }

    public Optional<InventoryItem> archive(Long id) {
        return repo.findById(id).map(item -> {
            item.setIsArchived(true);
            return repo.save(item);
        });
    }
}