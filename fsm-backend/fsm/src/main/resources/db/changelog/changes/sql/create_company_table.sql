CREATE TABLE company (
                         id BIGSERIAL PRIMARY KEY,

                         legal_name VARCHAR(255) NOT NULL,
                         brand_name VARCHAR(255),

                         phone VARCHAR(20),
                         email VARCHAR(255),

                         office_address TEXT,
                         city VARCHAR(100),
                         state VARCHAR(100),
                         pincode VARCHAR(20),
                         country VARCHAR(100),

                         is_gst_registered BOOLEAN DEFAULT FALSE,

                         gst_identification_number VARCHAR(50),
                         gst_name VARCHAR(255),

                         registered_gst_address TEXT,
                         registered_state VARCHAR(100),
                         registered_pin VARCHAR(20),

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         created_by TEXT,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_by TEXT,

                         is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                         deleted_at TIMESTAMP,
                         deleted_by TEXT
);