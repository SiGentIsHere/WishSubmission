// Supabase Configuration
// Replace these values with your actual Supabase project credentials

const SUPABASE_URL = 'https://efehrnwbfrtftjylmlci.supabase.co'; // e.g., 'https://xxxxxxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZWhybndiZnJ0ZnRqeWxtbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc5MTksImV4cCI6MjA3NjYxMzkxOX0.ZyGTr6oEHiy6CYX3AS_iUfL208Ncq2tWMjVYyGwjB40'; // Your anon/public key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized');
