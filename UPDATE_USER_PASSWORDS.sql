-- Update existing user passwords with correct bcrypt hash
-- Password for all accounts: password123
-- New Bcrypt hash: $2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72

UPDATE users
SET password_hash = '$2b$10$bAEgoZgMECqF/nH.05oH2.2Z6Ov5e8myeFKucCqWkpW/9fRDK8O72'
WHERE email IN (
  'owner@presidentialcuts.com',
  'nacho@presidentialcuts.com',
  'customer@test.com',
  'jane@test.com'
);

-- Verify the update
SELECT
  email,
  name,
  is_barber,
  is_owner,
  LEFT(password_hash, 30) as password_hash_preview
FROM users
WHERE email IN (
  'owner@presidentialcuts.com',
  'nacho@presidentialcuts.com',
  'customer@test.com',
  'jane@test.com'
)
ORDER BY email;
