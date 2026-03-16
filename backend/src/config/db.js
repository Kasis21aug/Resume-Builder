const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client using the service role key
// Service role key bypasses Row Level Security — safe to use on the server
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const connectDB = async () => {
  try {
    // Test the connection by making a simple query
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table empty, which is fine
      throw error;
    }
    console.log('✅ Supabase connected successfully!');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    console.error('Check your SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
  }
};

module.exports = { supabase, connectDB };
