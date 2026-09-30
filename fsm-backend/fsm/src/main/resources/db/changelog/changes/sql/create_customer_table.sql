CREATE TABLE customers (
                           id BIGSERIAL PRIMARY KEY,

                           name VARCHAR(150) NOT NULL,
                           phone VARCHAR(20) NOT NULL,
                           address TEXT,

                           company_id BIGINT NOT NULL,

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           created_by TEXT,
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_by TEXT,

                           is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                           deleted_at TIMESTAMP,
                           deleted_by TEXT,

                           CONSTRAINT fk_customers_company
                               FOREIGN KEY (company_id)
                                   REFERENCES company(id)
);