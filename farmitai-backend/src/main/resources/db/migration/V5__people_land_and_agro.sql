CREATE TABLE farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    first_name VARCHAR(120) NOT NULL,
    last_name VARCHAR(120) NOT NULL DEFAULT '',
    location VARCHAR(255),
    district VARCHAR(120),
    province VARCHAR(120),
    country VARCHAR(80) NOT NULL DEFAULT 'Zimbabwe',
    farming_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agronomist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    first_name VARCHAR(120) NOT NULL,
    last_name VARCHAR(120) NOT NULL DEFAULT '',
    district VARCHAR(120),
    specialty VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES farmer_profiles (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    area_hectares NUMERIC(12, 2),
    location VARCHAR(255),
    district VARCHAR(120),
    province VARCHAR(120),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT farms_status_check CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX farms_farmer_id_idx ON farms (farmer_id);
CREATE INDEX farms_district_idx ON farms (district);

CREATE TABLE farm_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    area_hectares NUMERIC(12, 2),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    soil_type VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX farm_fields_farm_id_idx ON farm_fields (farm_id);

CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE crop_varieties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops (id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT crop_varieties_unique UNIQUE (crop_id, name)
);

CREATE TABLE agro_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users (id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT agro_businesses_status_check CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED'))
);

CREATE INDEX agro_businesses_status_idx ON agro_businesses (status);

CREATE TABLE agro_business_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agro_business_id UUID NOT NULL REFERENCES agro_businesses (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    district VARCHAR(120),
    province VARCHAR(120),
    country VARCHAR(80) NOT NULL DEFAULT 'Zimbabwe',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX agro_business_locations_business_idx ON agro_business_locations (agro_business_id);

INSERT INTO crops (name, scientific_name, description) VALUES
    ('Maize', 'Zea mays', 'Staple cereal crop across Zimbabwe.'),
    ('Groundnuts', 'Arachis hypogaea', 'Legume grown for food and oil.'),
    ('Beans', 'Phaseolus vulgaris', 'Common bean for household food and markets.'),
    ('Tomatoes', 'Solanum lycopersicum', 'Horticulture crop for local markets.'),
    ('Tobacco', 'Nicotiana tabacum', 'Cash crop grown in several districts.'),
    ('Vegetables', NULL, 'Mixed vegetable production for household and market.');
