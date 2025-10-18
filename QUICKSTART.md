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

**Easy Way:** Run the `CREATE_TEST_USERS.sql` script in Supabase SQL Editor:

```bash
# In Supabase SQL Editor, copy and run the entire CREATE_TEST_USERS.sql file
```

This creates 4 test accounts:
- **Owner:** owner@presidentialcuts.com / password123
- **Barber:** nacho@presidentialcuts.com / password123
- **Customer:** customer@test.com / password123
- **Customer 2:** jane@test.com / password123

**Manual Way (if you need custom accounts):**

The bcrypt hash for "password123" is:
`$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72`

See `CREATE_TEST_USERS.sql` for full examples of creating users, barbers, schedules, etc.

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
- Go to Login page and select the **"Barber"** tab
- Email: `nacho@presidentialcuts.com`
- Password: `password123`
- You'll see your appointments and client information

### Test Owner Login
- Go to Login page (can use either Customer or Barber tab)
- Email: `owner@presidentialcuts.com`
- Password: `password123`
- You can manage barbers and view all appointments

**Note:** Owners can login from either tab. The system will automatically detect they're an owner and redirect to the owner dashboard.

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
