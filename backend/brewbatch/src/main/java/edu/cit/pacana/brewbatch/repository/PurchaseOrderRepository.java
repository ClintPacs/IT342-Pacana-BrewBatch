package edu.cit.pacana.brewbatch.repository;

import edu.cit.pacana.brewbatch.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
}