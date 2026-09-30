ALTER TABLE jobs
    ADD COLUMN starting_date_time TIMESTAMP NULL,
ADD COLUMN ending_date_time TIMESTAMP NULL,
ADD COLUMN employee_status VARCHAR(30) NULL,
ADD COLUMN category_id BIGINT NULL,
ADD COLUMN part_id BIGINT NULL;

ALTER TABLE jobs
    ADD CONSTRAINT fk_jobs_category
        FOREIGN KEY (category_id)
            REFERENCES category(id);

ALTER TABLE jobs
    ADD CONSTRAINT fk_jobs_part
        FOREIGN KEY (part_id)
            REFERENCES parts(id);