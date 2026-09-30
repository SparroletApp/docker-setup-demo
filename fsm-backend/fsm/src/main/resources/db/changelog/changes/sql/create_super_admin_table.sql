CREATE TABLE super_admin (
                             id BIGSERIAL PRIMARY KEY,

                             email VARCHAR(255) NOT NULL UNIQUE,
                             password VARCHAR(255) NOT NULL,
                             role VARCHAR(30) NOT NULL DEFAULT 'SUPER_ADMIN',

                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             created_by TEXT,

                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_by TEXT,

                             is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                             deleted_at TIMESTAMP,
                             deleted_by TEXT
);