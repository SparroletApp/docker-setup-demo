CREATE TABLE jobs (
                      id BIGSERIAL PRIMARY KEY,
                      created_at TIMESTAMP NOT NULL,
                      created_by TEXT,
                      updated_at TIMESTAMP NOT NULL,
                      updated_by TEXT,
                      is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                      deleted_at TIMESTAMP,
                      deleted_by TEXT,
                      user_id BIGINT,
                      customer_id BIGINT NOT NULL,
                      ticket_id BIGINT NOT NULL,
                      job_title VARCHAR(200) NOT NULL,
                      priority VARCHAR(30) NOT NULL,
                      expected_date TIMESTAMP,
                      job_description TEXT,
                      status VARCHAR(30) NOT NULL,
                      CONSTRAINT fk_jobs_user
                          FOREIGN KEY (user_id)
                              REFERENCES users(id),
                      CONSTRAINT fk_jobs_customer
                          FOREIGN KEY (customer_id)
                              REFERENCES customers(id),
                      CONSTRAINT fk_jobs_ticket
                          FOREIGN KEY (ticket_id)
                              REFERENCES tickets(id)
);