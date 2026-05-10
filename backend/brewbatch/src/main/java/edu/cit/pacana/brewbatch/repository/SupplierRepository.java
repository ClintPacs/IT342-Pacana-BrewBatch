package edu.cit.pacana.brewbatch.repository;

import edu.cit.pacana.brewbatch.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByArchivedFalse();
}