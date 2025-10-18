# Database Setup Instructions

## Quick Database Setup

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/sql/new

2. Copy and paste ALL of the SQL below and click "Run"

---

```sql
-- Presidential Cuts Database Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Insert Initial Services Data
INSERT INTO services (name, price, duration_minutes, day_restriction) VALUES
('Adults and Kids Haircuts', 45.00, 30, NULL),
('Senior/Veterans Day', 35.00, 30, 'Monday,Wednesday'),
('Haircut & Shave', 60.00, 45, NULL),
('Full Service Beard Shave & Facial', 60.00, 60, NULL),
('Earwax Removal', 10.00, 15, NULL),
('Black Mask', 20.00, 30, NULL)
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_barber_date ON appointments(barber_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_barber_services_barber ON barber_services(barber_id);
CREATE INDEX IF NOT EXISTS idx_barber_schedules_barber ON barber_schedules(barber_id);
CREATE INDEX IF NOT EXISTS idx_schedule_overrides_barber_date ON schedule_overrides(barber_id, date);
```

---

## Create Test Accounts

After the tables are created, run these queries to create test accounts:

### 1. Create Owner Account

```sql
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'owner@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Shop Owner',
  '7608088113',
  false,
  true
);
```

Login: `owner@test.com` / Password: `password123`

### 2. Create Barber Account & Profile

Run this in multiple steps:

**Step 1: Create User**
```sql
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'barber@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'John the Barber',
  '7608088114',
  true,
  false
);
```

**Step 2: Get User ID**
```sql
SELECT id FROM users WHERE email = 'barber@test.com';
```

Copy the ID returned (it will be a UUID like: `123e4567-e89b-12d3-a456-426614174000`)

**Step 3: Create Barber Profile**
Replace `PASTE_USER_ID_HERE` with the ID from Step 2:
```sql
INSERT INTO barbers (user_id, bio, is_active)
VALUES (
  'PASTE_USER_ID_HERE',
  'Expert barber specializing in fades, tapers, and classic cuts. 10+ years of experience.',
  true
);
```

**Step 4: Get Barber ID**
```sql
SELECT id FROM barbers WHERE user_id = 'PASTE_USER_ID_HERE';
```

Copy this barber ID.

**Step 5: Link to All Services**
Replace `PASTE_BARBER_ID_HERE` with the ID from Step 4:
```sql
INSERT INTO barber_services (barber_id, service_id)
SELECT 'PASTE_BARBER_ID_HERE', id FROM services;
```

**Step 6: Set Weekly Schedule**
Replace `PASTE_BARBER_ID_HERE` with the ID from Step 4:
```sql
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
VALUES
  ('PASTE_BARBER_ID_HERE', 1, '07:00:00', '16:00:00'),
  ('PASTE_BARBER_ID_HERE', 2, '07:00:00', '16:00:00'),
  ('PASTE_BARBER_ID_HERE', 3, '07:00:00', '16:00:00'),
  ('PASTE_BARBER_ID_HERE', 4, '07:00:00', '16:00:00'),
  ('PASTE_BARBER_ID_HERE', 5, '07:00:00', '16:00:00'),
  ('PASTE_BARBER_ID_HERE', 6, '07:00:00', '16:00:00');
```

Login: `barber@test.com` / Password: `password123`

---

## Verify Setup

Run these queries to check everything was created:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check services
SELECT * FROM services;

-- Check users
SELECT id, email, name, is_barber, is_owner FROM users;

-- Check barbers
SELECT b.id, u.name, b.is_active
FROM barbers b
JOIN users u ON b.user_id = u.id;

-- Check barber schedules
SELECT bs.*, u.name as barber_name
FROM barber_schedules bs
JOIN barbers b ON bs.barber_id = b.id
JOIN users u ON b.user_id = u.id;
```

---

## Done!

Now you can run the React app with `npm start` and test the booking system!
