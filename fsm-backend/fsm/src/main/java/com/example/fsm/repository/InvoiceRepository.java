package com.example.fsm.repository;

import com.example.fsm.entity.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository
        extends JpaRepository<InvoiceEntity, Long> {

    Optional<InvoiceEntity> findByIdAndDeletedFalse(Long id);
    List<InvoiceEntity> findAllByDeletedFalse();
    Optional<InvoiceEntity> findByInvoiceIdAndDeletedFalse(
            String invoiceId
    );
    boolean existsByInvoiceIdAndDeletedFalse(
            String invoiceId
    );
    List<InvoiceEntity> findAllByTicket_IdAndDeletedFalse(
            Long ticketId
    );
}
