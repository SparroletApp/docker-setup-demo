CREATE TABLE invoice (
                         id BIGSERIAL PRIMARY KEY,

                         invoice_id VARCHAR(50) NOT NULL UNIQUE,

                         ticket_id BIGINT NOT NULL,

                         service_type_id BIGINT,

                         job_ids BIGINT[] NOT NULL,

                         service_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

                         parts_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

                         tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

                         total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

                         working_hours NUMERIC(8, 2) DEFAULT 0.00,

                         status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',

                         payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

                         payment_method VARCHAR(30),

                         notes TEXT,

                         created_at TIMESTAMP NOT NULL,

                         created_by TEXT,

                         updated_at TIMESTAMP NOT NULL,

                         updated_by TEXT,

                         is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

                         deleted_at TIMESTAMP,

                         deleted_by TEXT,

                         CONSTRAINT fk_invoice_ticket
                             FOREIGN KEY (ticket_id)
                                 REFERENCES tickets(id),

                         CONSTRAINT fk_invoice_service_type
                             FOREIGN KEY (service_type_id)
                                 REFERENCES service_type(id)
);