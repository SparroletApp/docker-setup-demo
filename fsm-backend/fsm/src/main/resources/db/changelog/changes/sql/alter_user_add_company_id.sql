ALTER TABLE users
    ADD COLUMN company_id BIGINT,
ADD CONSTRAINT fk_users_company
FOREIGN KEY (company_id)
REFERENCES company(id);