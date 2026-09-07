import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qblvfzsikarqfdbacrud.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_uBDx9kYmbRPrTqg4mTaqSA_AuUau9uT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
