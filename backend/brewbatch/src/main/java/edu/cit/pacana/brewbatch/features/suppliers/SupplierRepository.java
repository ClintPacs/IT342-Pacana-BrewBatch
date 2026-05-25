package edu.cit.pacana.brewbatch.features.suppliers;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByArchivedFalse();
    Optional<Supplier> findByName(String name);
    Optional<Supplier> findByEmail(String email);
}