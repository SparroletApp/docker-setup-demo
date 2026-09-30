package com.example.fsm.repository;

import com.example.fsm.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DashboardRepository
        extends JpaRepository<UserEntity, Long> {

    /*
     * =========================================================
     * ACTIVE TECHNICIERS
     * =========================================================
     */
    @Query("""
        SELECT COUNT(u)
        FROM UserEntity u
        WHERE u.role = 'TECHNICIAN'
          AND u.deleted = false
    """)
    long countActiveTechnicians();


    /*
     * =========================================================
     * PENDING / INCOMPLETE TICKETS
     * =========================================================
     */
    @Query("""
        SELECT COUNT(t)
        FROM TicketEntity t
        WHERE t.companyId = :companyId
          AND t.deleted = false
          AND (
                t.status IS NULL
                OR UPPER(t.status) <> 'COMPLETED'
          )
    """)
    long countPendingTicketsByCompany(
            @Param("companyId") Long companyId
    );


    /*
     * =========================================================
     * TOTAL ACTIVE CUSTOMERS
     * =========================================================
     */
    @Query("""
        SELECT COUNT(c)
        FROM CustomersEntity c
        WHERE c.company.id = :companyId
          AND c.deleted = false
    """)
    long countActiveCustomersByCompany(
            @Param("companyId") Long companyId
    );


    /*
     * =========================================================
     * PENDING / INCOMPLETE JOBS
     * =========================================================
     *
     * Job belongs to a company through its Ticket.
     *
     * Counts:
     * - jobs belonging to the company
     * - deleted = false
     * - status is not COMPLETED
     *
     * NULL status is also considered pending.
     */
    @Query("""
        SELECT COUNT(j)
        FROM JobEntity j
        JOIN j.ticket t
        WHERE t.companyId = :companyId
          AND j.deleted = false
          AND (
                j.status IS NULL
                OR UPPER(j.status) <> 'COMPLETED'
          )
    """)
    long countPendingJobsByCompany(
            @Param("companyId") Long companyId
    );
}