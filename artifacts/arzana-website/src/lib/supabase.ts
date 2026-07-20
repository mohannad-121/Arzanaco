import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wkplhatdyhyiwaujoydf.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_-4qIW59LzPf7pbBayUdJ5Q_OdSewOhT';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: false },
});
