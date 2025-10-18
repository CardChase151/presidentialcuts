-- Create Test Users for Presidential Cuts
-- Password for all accounts: password123
-- Bcrypt hash: $2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72

-- 1. Create Owner Account
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'owner@presidentialcuts.com',
  '$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72',
  'Shop Owner',
  '7608088113',
  false,
  true
);

-- 2. Create Barber User
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'nacho@presidentialcuts.com',
  '$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72',
  'Nacho The Barber',
  '7608088114',
  true,
  false
);

-- 3. Create Barber Profile
-- Get the user ID for the barber we just created
DO $$
DECLARE
  nacho_user_id UUID;
  nacho_barber_id UUID;
BEGIN
  -- Get Nacho's user ID
  SELECT id INTO nacho_user_id FROM users WHERE email = 'nacho@presidentialcuts.com';

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
END $$;

-- 4. Create Customer Account
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'customer@test.com',
  '$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72',
  'John Customer',
  '7601234567',
  false,
  false
);

-- 5. Create Additional Customer
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'jane@test.com',
  '$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72',
  'Jane Doe',
  '7609876543',
  false,
  false
);

-- Verify Created Accounts
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

-- Show created barbers
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
