import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugqkwpzdixxixkrewbvp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_llUVHAzOzu-Qi6QMtbx_bQ_jJCofTPA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
