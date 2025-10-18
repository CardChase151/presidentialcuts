-- ===================================================================
-- PRESIDENTIAL CUTS - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor to set up everything
-- ===================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- PART 1: CREATE TABLES
-- ===================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  is_barber BOOLEAN DEFAULT FALSE,
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Barbers Table
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  day_restriction TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Barber Services (Junction Table)
CREATE TABLE IF NOT EXISTS barber_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE(barber_id, service_id)
);

-- 5. Barber Schedules
CREATE TABLE IF NOT EXISTS barber_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(barber_id, day_of_week)
);

-- 6. Schedule Overrides
CREATE TABLE IF NOT EXISTS schedule_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id),
  client_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed',
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_barber_date ON appointments(barber_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_barber_services_barber ON barber_services(barber_id);
CREATE INDEX IF NOT EXISTS idx_barber_schedules_barber ON barber_schedules(barber_id);
CREATE INDEX IF NOT EXISTS idx_schedule_overrides_barber_date ON schedule_overrides(barber_id, date);

-- ===================================================================
-- PART 2: INSERT INITIAL SERVICES
-- ===================================================================

INSERT INTO services (name, price, duration_minutes, day_restriction) VALUES
('Adults and Kids Haircuts', 45.00, 30, NULL),
('Senior/Veterans Day', 35.00, 30, 'Monday,Wednesday'),
('Haircut & Shave', 60.00, 45, NULL),
('Full Service Beard Shave & Facial', 60.00, 60, NULL),
('Earwax Removal', 10.00, 15, NULL),
('Black Mask', 20.00, 30, NULL)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- PART 3: CREATE TEST USERS
-- Password for all accounts: password123
-- ===================================================================

-- Owner Account
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'owner@presidentialcuts.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Shop Owner',
  '7608088113',
  false,
  true
)
ON CONFLICT (email) DO NOTHING;

-- Barber User
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'nacho@presidentialcuts.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Nacho The Barber',
  '7608088114',
  true,
  false
)
ON CONFLICT (email) DO NOTHING;

-- Customer Accounts
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'customer@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'John Customer',
  '7601234567',
  false,
  false
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'jane@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Jane Doe',
  '7609876543',
  false,
  false
)
ON CONFLICT (email) DO NOTHING;

-- ===================================================================
-- PART 4: CREATE BARBER PROFILE & SCHEDULE
-- ===================================================================

DO $$
DECLARE
  nacho_user_id UUID;
  nacho_barber_id UUID;
BEGIN
  -- Get Nacho's user ID
  SELECT id INTO nacho_user_id FROM users WHERE email = 'nacho@presidentialcuts.com';

  -- Check if barber profile already exists
  IF NOT EXISTS (SELECT 1 FROM barbers WHERE user_id = nacho_user_id) THEN
    -- Create barber profile
    INSERT INTO barbers (user_id, bio, is_active)
    VALUES (
      nacho_user_id,
      'Master barber with 10+ years of experience specializing in precision fades, tapers, and classic cuts.',
      true
    )
    RETURNING id INTO nacho_barber_id;

    -- Link barber to all services
    INSERT INTO barber_services (barber_id, service_id)
    SELECT nacho_barber_id, id FROM services;

    -- Set weekly schedule (Monday-Saturday, 7 AM - 4 PM)
    INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
    VALUES
      (nacho_barber_id, 1, '07:00:00', '16:00:00'),
      (nacho_barber_id, 2, '07:00:00', '16:00:00'),
      (nacho_barber_id, 3, '07:00:00', '16:00:00'),
      (nacho_barber_id, 4, '07:00:00', '16:00:00'),
      (nacho_barber_id, 5, '07:00:00', '16:00:00'),
      (nacho_barber_id, 6, '07:00:00', '16:00:00');

    RAISE NOTICE 'Barber profile created successfully!';
  ELSE
    RAISE NOTICE 'Barber profile already exists, skipping creation.';
  END IF;
END $$;

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Show all users
SELECT
  id,
  email,
  name,
  phone,
  is_barber,
  is_owner,
  created_at
FROM users
ORDER BY created_at DESC;

-- Show services
SELECT * FROM services ORDER BY price;

-- Show barbers
SELECT
  b.id as barber_id,
  u.name as barber_name,
  u.email,
  b.bio,
  b.is_active
FROM barbers b
JOIN users u ON b.user_id = u.id;

-- Show barber schedules
SELECT
  u.name as barber_name,
  bs.day_of_week,
  bs.start_time,
  bs.end_time
FROM barber_schedules bs
JOIN barbers b ON bs.barber_id = b.id
JOIN users u ON b.user_id = u.id
ORDER BY u.name, bs.day_of_week;

-- ===================================================================
-- SETUP COMPLETE!
-- Login credentials (password for all: password123):
-- - Owner: owner@presidentialcuts.com
-- - Barber: nacho@presidentialcuts.com
-- - Customer: customer@test.com or jane@test.com
-- ===================================================================
