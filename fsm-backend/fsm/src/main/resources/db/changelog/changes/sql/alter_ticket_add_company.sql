ALTER TABLE tickets
    ADD COLUMN company_id BIGINT;

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_company
        FOREIGN KEY (company_id)
            REFERENCES company(id);