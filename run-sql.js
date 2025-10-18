const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://zffpfdxzhmwiywddwfmu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZnBmZHh6aG13aXl3ZGR3Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTc0MTEsImV4cCI6MjA3NjMzMzQxMX0.IJJ0MyIRK3WAmoEPcNmmbDbD34w4eP4GbWPb5GXSsRE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
  console.log('Running database setup...');

  // Read the SQL files
  const setupSQL = fs.readFileSync('./database-setup.sql', 'utf8');
  const usersSQL = fs.readFileSync('./CREATE_TEST_USERS.sql', 'utf8');

  // Note: The anon key can't execute arbitrary SQL
  // We need to use the service role key or run this via the Supabase dashboard
  console.log('\n⚠️  Cannot execute SQL with anon key.');
  console.log('\nPlease run the SQL files manually in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/sql/new');
  console.log('\n1. First run: database-setup.sql');
  console.log('2. Then run: CREATE_TEST_USERS.sql');
}

runSQL();
