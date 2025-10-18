# Presidential Cuts - Booking System

A modern React-based booking system for Presidential Cuts barbershop in Rancho Mirage, CA.

## Features

### Public Website
- **Home Page**: Hero section, about, services display, and location information
- **Responsive Design**: Mobile-friendly navigation and layout
- **Service Display**: Dynamic services fetched from Supabase database

### Booking System
- **Select Barber**: Choose from active barbers with photos and bios
- **Calendar Interface**: Visual date picker with availability indicators
- **Time Slot Selection**: Dynamic time slots based on barber schedules
- **Service Selection**: Filter services based on barber capabilities and day restrictions
- **Guest Checkout**: Book appointments without creating an account
- **User Booking**: Logged-in users get auto-filled information

### Authentication
- **Dual Login**: Separate customer and barber login tabs
- **Registration**: New customer account creation
- **Secure**: Password hashing with bcrypt
- **Session Management**: Persistent login state

### Client Dashboard
- **View Appointments**: See upcoming and past appointments
- **Cancel Appointments**: Cancel upcoming bookings
- **Book More**: Quick access to booking flow
- **Appointment Details**: Full service, barber, date, time, and pricing information

### Barber Dashboard
- **View Schedule**: See all confirmed appointments
- **Client Information**: Access to client contact details
- **Appointment Management**: Track upcoming appointments

### Owner Dashboard
- **Manage Barbers**: Activate/deactivate barbers
- **View All Appointments**: See appointments across all barbers
- **Business Overview**: Complete view of all bookings

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with bcrypt
- **Date Management**: date-fns
- **Styling**: Custom CSS with responsive design

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### 2. Database Setup

1. Create a new Supabase project at https://supabase.com
2. In the SQL Editor, run the SQL script from `database-setup.sql` to create all tables and initial data
3. Note your Project URL and anon/public API key from Project Settings > API

### 3. Environment Configuration

1. Open `.env` in the project root
2. Replace the placeholders with your actual Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install Dependencies

```bash
cd /Users/chasekellis/Apps/presidentialcuts
npm install
```

### 5. Run Development Server

```bash
npm start
```

The app will open at http://localhost:3000

## Database Schema

### Tables

1. **users**: User accounts (clients, barbers, owners)
2. **barbers**: Barber profiles with photos and bios
3. **services**: Available services with pricing and duration
4. **barber_services**: Junction table linking barbers to their offered services
5. **barber_schedules**: Weekly schedules for each barber
6. **schedule_overrides**: Date-specific schedule changes
7. **appointments**: Booking records

## Creating Test Data

### Create an Owner Account

```sql
-- First, create a user
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'owner@presidentialcuts.com',
  '$2a$10$yourhashedpassword', -- Use bcrypt to hash 'password123'
  'Shop Owner',
  '7608088113',
  false,
  true
);
```

### Create a Barber

```sql
-- Create barber user
INSERT INTO users (email, password_hash, name, phone, is_barber, is_owner)
VALUES (
  'barber@presidentialcuts.com',
  '$2a$10$yourhashedpassword',
  'John the Barber',
  '7608088114',
  true,
  false
)
RETURNING id;

-- Create barber profile (use the ID from above)
INSERT INTO barbers (user_id, bio, is_active)
VALUES (
  'user-id-from-above',
  'Expert in fades and classic cuts with 10 years of experience',
  true
)
RETURNING id;

-- Link barber to all services (use barber ID from above)
INSERT INTO barber_services (barber_id, service_id)
SELECT 'barber-id-from-above', id FROM services;

-- Set weekly schedule (Monday = 1, Friday = 5)
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
VALUES
  ('barber-id', 1, '07:00:00', '16:00:00'),
  ('barber-id', 2, '07:00:00', '16:00:00'),
  ('barber-id', 3, '07:00:00', '16:00:00'),
  ('barber-id', 4, '07:00:00', '16:00:00'),
  ('barber-id', 5, '07:00:00', '16:00:00'),
  ('barber-id', 6, '07:00:00', '16:00:00');
```

## Project Structure

```
presidentialcuts/
├── public/
├── src/
│   ├── assets/              # Images (logo, photos)
│   ├── components/
│   │   ├── Layout/          # Header, Footer, Layout
│   │   ├── Home/            # Hero, About, Services, Location
│   │   ├── Booking/         # Booking flow components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard specific components
│   │   ├── Barber/          # Barber management components
│   │   └── Owner/           # Owner management components
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login/Register page
│   │   ├── Booking/         # Booking pages
│   │   └── Dashboard/       # Dashboard pages
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── BookingContext.jsx # Booking flow state
│   ├── services/
│   │   └── supabase.js      # Supabase client
│   ├── App.js               # Main app with routing
│   └── index.js             # Entry point
├── database-setup.sql       # Database schema and seed data
├── .env                     # Environment variables
└── README.md
```

## Usage

### For Customers
1. Visit the home page
2. Click "Book Now" or navigate to the booking page
3. Select your preferred barber
4. Choose a date, time, and service
5. Either login/register or continue as guest
6. Confirm your appointment

### For Barbers
1. Login using barber credentials
2. View your upcoming appointments
3. Access client contact information

### For Owners
1. Login using owner credentials
2. Manage barber activation status
3. View all appointments across all barbers
4. Monitor business operations

## Future Enhancements

- [ ] Email notifications for appointment confirmations and reminders
- [ ] SMS notifications via OneSignal
- [ ] Barber schedule self-management
- [ ] Service management UI for owners
- [ ] Barber onboarding with QR codes
- [ ] Recurring appointment bookings
- [ ] Analytics and reporting
- [ ] Payment integration
- [ ] Client review system
- [ ] Photo gallery management

## Support

For issues or questions, contact: (760) 808-8113

## License

© 2025 Presidential Cuts. All rights reserved.
