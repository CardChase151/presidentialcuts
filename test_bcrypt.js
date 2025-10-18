const bcrypt = require('bcryptjs');

// The hash from CREATE_TEST_USERS.sql
const storedHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const password = 'password123';

console.log('Testing bcrypt hash...\n');
console.log('Password:', password);
console.log('Stored hash:', storedHash);

bcrypt.compare(password, storedHash, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('\nPassword match:', result);

    if (result) {
      console.log('✅ The hash is correct! Login should work.');
    } else {
      console.log('❌ The hash does NOT match. Generating new hash...\n');

      // Generate a new hash
      bcrypt.hash(password, 10, (err, newHash) => {
        if (err) {
          console.error('Error generating hash:', err);
        } else {
          console.log('New bcrypt hash for "password123":');
          console.log(newHash);
          console.log('\nUpdate your CREATE_TEST_USERS.sql with this new hash.');
        }
      });
    }
  }
});
