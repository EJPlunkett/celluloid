import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yrzugdmatddwypzdirhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyenVnZG1hdGRkd3lwemRpcmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTI1NzgsImV4cCI6MjA3MTAyODU3OH0.u8hELZgjyGIcWyxtMLJAdXQK_5XQ2QRr-Wijt3BLfpE'

export const supabase = createClient(supabaseUrl, supabaseKey)