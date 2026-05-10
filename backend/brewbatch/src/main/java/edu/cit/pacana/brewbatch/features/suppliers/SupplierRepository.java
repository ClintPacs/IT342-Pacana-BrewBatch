package edu.cit.pacana.brewbatch.features.suppliers;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByArchivedFalse();
}