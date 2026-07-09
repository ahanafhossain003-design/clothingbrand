-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    category_id UUID,
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    size_chart_image TEXT,
    colors TEXT[] NOT NULL DEFAULT '{}',
    inventory INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories Table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Banners Table
CREATE TABLE banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    link TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'Pending order',
    is_viewed BOOLEAN DEFAULT false,
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_notes TEXT,
    
    -- Payment Info
    payment_method TEXT NOT NULL,
    payment_sender_number TEXT,
    payment_transaction_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Foreign Key for Products to Categories
ALTER TABLE products ADD CONSTRAINT fk_products_category 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
