
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jveonxdljbjusafgeuhw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZW9ueGRsamJqdXNhZmdldWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjA1MDcsImV4cCI6MjA2MDAzNjUwN30.wg2J0tmF4KX3BgvmRawVurHviACg0qM0N8aSZKRoluM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
