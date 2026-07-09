import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from './index';

export function useSupabaseSync() {
  const store = useAppStore();

  useEffect(() => {
    let isMounted = true;

    async function syncBanners() {
      try {
        const { data, error } = await supabase.from('banners').select('*').order('order', { ascending: true });
        if (error) {
          console.error("Supabase error (banners):", error.message);
          return;
        }
        
        if (data && data.length > 0 && isMounted) {
          // Map snake_case to camelCase
          const mappedBanners = data.map(b => ({
            id: b.id,
            imageUrl: b.image_url,
            title: b.title || undefined,
            subtitle: b.subtitle || undefined,
            link: b.link || undefined,
            order: b.order
          }));
          // Only update if different to avoid infinite loops
          useAppStore.setState({ banners: mappedBanners });
        } else if (data && data.length === 0) {
          // If supabase is empty, maybe push local banners?
          // We won't do it automatically to avoid overwriting with defaults if it's just a fresh device
        }
      } catch (err) {
        console.error("Failed to sync banners", err);
      }
    }

    syncBanners();
  }, []);
}
