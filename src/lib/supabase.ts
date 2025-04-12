
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jveonxdljbjusafgeuwkrn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZW9ueGRsamJqdXNhZmdldXdrbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ0NDYwNTA3LCJleHAiOjIwNjAwMzY1MDd9.wg2J0tmF4KX3BgvmRawVurHviACg0qM0N8aSZKRoluM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
