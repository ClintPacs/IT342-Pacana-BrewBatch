package edu.cit.pacana.brewbatch.features.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
    List<PurchaseOrder> findBySupplierEmailOrderByCreatedAtDesc(String supplierEmail);
    List<PurchaseOrder> findBySupplierAndSupplierEmailIsNullOrderByCreatedAtDesc(String supplier);
    List<PurchaseOrder> findByStatus(String status);
}