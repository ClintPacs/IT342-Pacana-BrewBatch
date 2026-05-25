package edu.cit.pacana.brewbatch.features.suppliers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findByArchivedFalse();
    }

    public Optional<Supplier> getByName(String name) {
        return supplierRepository.findByName(name);
    }

    public Supplier create(SupplierRequest req) {
        Supplier s = new Supplier();
        s.setName(req.getName());
        s.setContactName(req.getContactName());
        s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setAddress(req.getAddress());
        return supplierRepository.save(s);
    }

    public Supplier update(Long id, SupplierRequest req) {
        Supplier s = supplierRepository.findById(id).orElseThrow();
        s.setName(req.getName());
        s.setContactName(req.getContactName());
        s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setAddress(req.getAddress());
        return supplierRepository.save(s);
    }

    public void archive(Long id) {
        Supplier s = supplierRepository.findById(id).orElseThrow();
        s.setArchived(true);
        supplierRepository.save(s);
    }
}