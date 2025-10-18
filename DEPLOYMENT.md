# Deployment Guide - Presidential Cuts

## For Netlify Deployment

The app is already configured for Netlify with the `public/_redirects` file.

### Steps:
1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. Add environment variables:
   - `REACT_APP_SUPABASE_URL` = your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click "Deploy site"

### Important: The `_redirects` file
The `public/_redirects` file contains:
```
/* /index.html 200
```

This ensures that all routes (like `/book/service`, `/dashboard/client`, etc.) are handled by React Router instead of returning 404 errors when users refresh the page or navigate directly to a URL.

## For Vercel Deployment

Vercel automatically handles client-side routing, but you can also add a `vercel.json` if needed:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Local Testing

To test the production build locally:
```bash
npm run build
npx serve -s build
```

Then visit http://localhost:3000 and test refreshing on different routes.

## State Persistence

The booking flow now persists to `localStorage`, so users can:
- Refresh the page without losing their selections
- Close the browser and return to continue booking
- Navigate back and forth through the booking steps

The booking state is cleared when:
- User completes an appointment
- User clicks "Back to Barbers" from the first step
- User manually clears browser data
