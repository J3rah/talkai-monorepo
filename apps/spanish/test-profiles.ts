import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtxihsziwrypenfpqwat.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGloc3ppd3J5cGVuZnBxd2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDE0MDQsImV4cCI6MjA2MTAxNzQwNH0.Sz9uPlGxu0HqxiUGiDP_TDHqzZZIHCEKf8plYQ_8jqw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfilesTable() {
  try {
    // Try to get the table definition
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing profiles table:', error);
      return;
    }

    console.log('Profiles table exists and is accessible!');
    console.log('Table structure:', Object.keys(data[0] || {}));
  } catch (err) {
    console.error('Error:', err);
  }
}

testProfilesTable(); 