package edu.cit.pacana.brewbatch.features.invoices;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findBySupplierId(Long supplierId);
    List<Invoice> findByOrderId(Long orderId);
}
