const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://zffpfdxzhmwiywddwfmu.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZnBmZHh6aG13aXl3ZGR3Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc1NzQxMSwiZXhwIjoyMDc2MzMzNDExfQ.xtwKr2jZ7fhVxf7mHv2YTBwubkZS8dr04pHQyCE7O6M';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  console.log('🚀 Setting up Presidential Cuts database...\n');

  try {
    // Read the complete SQL file
    const sql = fs.readFileSync('./COMPLETE_SETUP.sql', 'utf8');

    console.log('📝 Executing SQL setup...');

    // Execute the SQL using rpc (note: this may not work for all SQL)
    // Better to use the Supabase dashboard, but let's try
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n⚠️  Please run COMPLETE_SETUP.sql manually in Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/sql/new');
    } else {
      console.log('✅ Database setup complete!');
      console.log(data);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n⚠️  Please run COMPLETE_SETUP.sql manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/zffpfdxzhmwiywddwfmu/sql/new');
  }
}

setupDatabase();
