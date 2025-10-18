# Quick Start Guide - Presidential Cuts

## Step 1: Configure Supabase

1. **Get your Supabase Anon Key:**
   - Go to: https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/settings/api
   - Copy the "anon/public" key
   - Open `.env` in the project root
   - Replace `YOUR_ANON_KEY_HERE` with your actual key

2. **Run the database setup:**
   - Go to: https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/sql
   - Copy the contents of `database-setup.sql`
   - Paste and run it in the SQL Editor
   - This creates all tables and adds initial services

## Step 2: Create Test Accounts

### Owner Account
Run this in Supabase SQL Editor (after hashing a password):

```sql
-- First hash your password using bcrypt (you can use an online tool)
-- For "password123", a bcrypt hash might look like:
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

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

### Barber Account
```sql
-- Create barber user
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'barber@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'John the Barber',
  '7608088114',
  true,
  false
)
RETURNING id;

-- Note the ID returned above, use it in the next queries
-- Create barber profile (replace 'USER-ID-HERE' with the actual UUID)
INSERT INTO barbers (user_id, bio, is_active)
VALUES (
  'USER-ID-HERE',
  'Expert barber with 10+ years of experience',
  true
)
RETURNING id;

-- Link barber to all services (replace 'BARBER-ID-HERE' with the UUID from above)
INSERT INTO barber_services (barber_id, service_id)
SELECT 'BARBER-ID-HERE', id FROM services;

-- Set weekly schedule (replace 'BARBER-ID-HERE')
-- 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
VALUES
  ('BARBER-ID-HERE', 1, '07:00:00', '16:00:00'),
  ('BARBER-ID-HERE', 2, '07:00:00', '16:00:00'),
  ('BARBER-ID-HERE', 3, '07:00:00', '16:00:00'),
  ('BARBER-ID-HERE', 4, '07:00:00', '16:00:00'),
  ('BARBER-ID-HERE', 5, '07:00:00', '16:00:00'),
  ('BARBER-ID-HERE', 6, '07:00:00', '16:00:00');
```

## Step 3: Run the App

```bash
cd /Users/chasekellis/Apps/presidentialcuts
npm start
```

## Step 4: Test the Application

### Test as a Customer
1. Go to http://localhost:3000
2. Click "Book Now"
3. Select a barber
4. Choose date, time, and service
5. Either:
   - Continue as guest (provide name and email)
   - Login/Register as a customer

### Test Barber Login
- Email: `barber@test.com`
- Password: `password123`
- You'll see your appointments and client information

### Test Owner Login
- Email: `owner@test.com`
- Password: `password123`
- You can manage barbers and view all appointments

## Password Hashing Tool

To create your own password hashes, use this Node.js code:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password-here';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Or use an online bcrypt generator: https://bcrypt-generator.com/

## Troubleshooting

### Database Connection Issues
- Check that your `.env` file has the correct REACT_APP_SUPABASE_ANON_KEY
- Restart the dev server after changing `.env`

### No Barbers Showing
- Make sure you created a barber in the database
- Check that `is_active = true` in the barbers table

### No Time Slots Available
- Verify the barber has a schedule set in `barber_schedules`
- Check that you selected a service
- Ensure you're selecting a future date

### Services with Day Restrictions
- "Senior/Veterans Day" only appears on Monday and Wednesday
- The system will alert you if you try to select a restricted service on the wrong day

## Next Steps

1. Add real barber photos by uploading to Supabase Storage and updating the `photo_url` field
2. Customize the services, prices, and durations in the `services` table
3. Update the location, hours, and contact info in the Home components
4. Set up email notifications (future enhancement)
5. Deploy to production (Vercel, Netlify, etc.)

## Support

Questions? Contact: (760) 808-8113
