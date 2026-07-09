-- Disable RLS on all tables temporarily to allow the app to work
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled, you must create policies:
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
-- CREATE POLICY "Public write products" ON products FOR ALL USING (true);
-- (and similarly for other tables)
