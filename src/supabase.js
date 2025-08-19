import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yrzugdmatddwypzdirhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyenVnZG1hdGRkd3lwemRpcmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDEwNzEsImV4cCI6MjA3MTIxNzA3MX0.2LUMRhFxfZW0jcr-DRajdPnajTQKwcQtAr_zraPZJd8'

export const supabase = createClient(supabaseUrl, supabaseKey)