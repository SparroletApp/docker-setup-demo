CREATE TABLE tickets (
                         id BIGSERIAL PRIMARY KEY,

                         service_type_id BIGINT NOT NULL,
                         customer_id BIGINT NOT NULL,
                         ticket_note TEXT,

                         created_at TIMESTAMP NOT NULL,
                         created_by TEXT,
                         updated_at TIMESTAMP NOT NULL,
                         updated_by TEXT,

                         is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                         deleted_at TIMESTAMP,
                         deleted_by TEXT,

                         CONSTRAINT fk_tickets_service_type
                             FOREIGN KEY (service_type_id)
                                 REFERENCES service_type(id),

                         CONSTRAINT fk_tickets_customer
                             FOREIGN KEY (customer_id)
                                 REFERENCES customers(id)
);