package edu.cit.pacana.brewbatch.features.invoices;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getBySupplier(Long supplierId) {
        return invoiceRepository.findBySupplierId(supplierId);
    }

    public Invoice create(InvoiceRequest req) {
        Invoice inv = new Invoice();
        inv.setSupplierId(req.getSupplierId());
        inv.setOrderId(req.getOrderId());
        inv.setAmount(req.getAmount());
        inv.setInvoiceNumber(req.getInvoiceNumber());
        inv.setNotes(req.getNotes());
        inv.setStatus("SUBMITTED");
        return invoiceRepository.save(inv);
    }

    public Invoice approve(Long id) {
        Invoice inv = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        inv.setStatus("APPROVED");
        return invoiceRepository.save(inv);
    }

    public Invoice pay(Long id) {
        Invoice inv = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        inv.setStatus("PAID");
        return invoiceRepository.save(inv);
    }
}
