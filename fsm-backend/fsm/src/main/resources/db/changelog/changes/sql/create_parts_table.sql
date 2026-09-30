CREATE TABLE parts (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(150) NOT NULL,
                       sku VARCHAR(100) NOT NULL UNIQUE,
                       category_id BIGINT NOT NULL,
                       stock_quantity INTEGER NOT NULL DEFAULT 0,
                       threshold_alert INTEGER NOT NULL DEFAULT 0,
                       unit_price DECIMAL(12, 2) NOT NULL,
                       retail_price DECIMAL(12, 2) NOT NULL,
                       supplier VARCHAR(150),
                       created_by VARCHAR(150),
                       created_at TIMESTAMP,
                       updated_by VARCHAR(150),
                       updated_at TIMESTAMP,
                       is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                       deleted_by VARCHAR(150),
                       deleted_at TIMESTAMP,
                       CONSTRAINT fk_parts_category
                           FOREIGN KEY (category_id)
                               REFERENCES category(id)
);