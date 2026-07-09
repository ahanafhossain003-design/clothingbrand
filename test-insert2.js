import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ugqkwpzdixxixkrewbvp.supabase.co', 'sb_publishable_llUVHAzOzu-Qi6QMtbx_bQ_jJCofTPA');
async function test() {
  const { data, error } = await supabase.from('banners').insert([{
    image_url: 'https://example.com/test.jpg',
    title: 'Test'
  }]);
  console.log("Insert2:", data, error);
}
test();
