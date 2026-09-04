INSERT INTO roles (id, name) VALUES
    ('44444444-4444-4444-4444-444444444444', 'AGRONOMIST')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE waiting_list
    ADD COLUMN applicant_type VARCHAR(20) NOT NULL DEFAULT 'FARMER';

ALTER TABLE waiting_list
    ADD CONSTRAINT waiting_list_applicant_type_check
    CHECK (applicant_type IN ('FARMER', 'AGRONOMIST'));

CREATE INDEX waiting_list_applicant_type_idx ON waiting_list (applicant_type);
