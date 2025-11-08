-- ============================================================
-- rebuild.sql
-- Purpose: Build the PostgreSQL course database with tables,
-- types, and insert sample data.
-- ============================================================

-- Drop database objects if they already exist (clean rebuild)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type_enum;

-- ============================================================
-- Create ENUM type for account_type
-- ============================================================
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');

-- ============================================================
-- Create Tables
-- ============================================================

-- Account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type account_type_enum DEFAULT 'Client'
);

-- Classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE NOT NULL
);

-- Inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    classification_id INT NOT NULL REFERENCES classification(classification_id)
);

-- ============================================================
-- Insert Sample Data
-- ============================================================

-- Insert into classification table
INSERT INTO classification (classification_name)
VALUES
('SUV'),
('Sport'),
('Truck');

-- Insert into inventory table
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES
('GM', 'Hummer', 'A rugged off-road vehicle with small interiors.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 1),
('Chevrolet', 'Corvette', 'A fast sports car with aerodynamic design.', '/images/corvette.jpg', '/images/corvette-tn.jpg', 2),
('Ford', 'F-150', 'A reliable pickup truck with great towing capacity.', '/images/f150.jpg', '/images/f150-tn.jpg', 3);

-- Optional: Insert one sample account (for testing)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Steve', 'Rogers', 'captain@avengers.com', 'Shield123');

-- ============================================================
-- Assignment 2 Queries (4 & 6 from Task 1)
-- ============================================================

-- Query 4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6: Update all image paths to include '/vehicles'
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- ============================================================
-- End of rebuild.sql
-- ============================================================
