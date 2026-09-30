CREATE TABLE service_type (
                              id BIGSERIAL PRIMARY KEY,
                              name VARCHAR(150) NOT NULL,
                              description TEXT,
                              created_at TIMESTAMP NOT NULL,
                              created_by TEXT,
                              updated_at TIMESTAMP NOT NULL,
                              updated_by TEXT,
                              is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                              deleted_at TIMESTAMP,
                              deleted_by TEXT
);