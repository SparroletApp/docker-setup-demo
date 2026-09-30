CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       auth_user_id UUID,
                       name VARCHAR(255) NOT NULL,
                       phone VARCHAR(20) NOT NULL UNIQUE,
                       role VARCHAR(50) NOT NULL,
                       status VARCHAR(30) DEFAULT 'ACTIVE',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                       created_by TEXT,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_by TEXT,
                       is_deleted BOOLEAN DEFAULT FALSE,
                       deleted_at TIMESTAMP,
                       deleted_by TEXT,
                       otp VARCHAR(6),
                       otp_expires_at TIMESTAMP
);