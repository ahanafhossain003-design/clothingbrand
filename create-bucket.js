import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ugqkwpzdixxixkrewbvp.supabase.co', 'sb_publishable_llUVHAzOzu-Qi6QMtbx_bQ_jJCofTPA');
async function test() {
  const { data, error } = await supabase.storage.createBucket('media', { public: true });
  console.log("Create Bucket:", data, error);
}
test();
