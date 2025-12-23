import { SUPABASE_ANON_KEY, SUPABASE_PUBLIC_URL } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';

export const supabase = createClient<Database>(SUPABASE_PUBLIC_URL, SUPABASE_ANON_KEY, {
	auth: { persistSession: false }
});
