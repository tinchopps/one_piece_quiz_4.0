// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://feuwpfmbhsdtlzrxjrsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXdwZm1iaHNkdGx6cnhqcnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTk4NTgsImV4cCI6MjA2OTYzNTg1OH0.V7R3Y_tb7M7dG1HBs0W5M8fARWy7SydDhQb1wF-NTpY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
