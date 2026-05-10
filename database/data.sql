--sample data

INSERT INTO categories (name) VALUES ('Fragrance Men');
INSERT INTO categories (name) VALUES ('Fragrance Women');
INSERT INTO categories (name) VALUES ('Fragrance Unisex');
INSERT INTO categories (name) VALUES ('Makeup Face');
INSERT INTO categories (name) VALUES ('Makeup Eyes');
INSERT INTO categories (name) VALUES ('Makeup Lips');

INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(1, 'Dior', 'Sauvage', 'Fresh and bold scent for men', 95.00, 25, '/images/dior_sav.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(1, 'Chanel', 'Bleu de Chanel', 'Fresh woody fragrance for men', 120.00, 30, '/images/bleu_chan.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(1, 'Giorgio Armani', 'Acqua di Gio', 'Light aquatic fragrance', 85.00, 20, '/images/aqua_gio.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(2, 'Chanel', 'No. 5', 'Iconic floral fragrance for women', 150.00, 15, '/images/chanel_no5.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(2, 'Dior', 'Miss Dior', 'Romantic and feminine scent', 110.00, 20, '/images/miss_dior.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(2, 'YSL', 'Black Opium', 'Bold and seductive for women', 105.00, 18, '/images/black_opium.png');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(3, 'Calvin Klein', 'CK One', 'Classic fresh unisex scent', 65.00, 40, '/images/ck_one.png');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(4, 'MAC', 'Studio Fix Foundation', 'Full coverage foundation', 35.00, 50, '/images/studio_fix.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(4, 'NYX', 'Concealer', 'Full coverage concealer', 12.00, 75, '/images/nyx_conc.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(5, 'Urban Decay', 'Naked Palette', 'Neutral eyeshadow palette', 54.00, 30, '/images/naked.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(5, 'Maybelline', 'Sky High Mascara', 'Lengthening mascara', 14.00, 60, '/images/sky_high.png');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(6, 'MAC', 'Ruby Woo', 'Classic red lipstick', 22.00, 45, '/images/ruby_woo.jpg');
INSERT INTO products (category_id, brand, name, description, price, stock_quantity, image_url) VALUES
(6, 'NYX', 'Butter Gloss', 'Sheer lip gloss', 8.00, 80, '/images/butter.jpg');

-- coupons
INSERT INTO coupons (code, discount_type, discount_value, expires_at) VALUES
('SAVE20', 'percent', 20, '2026-12-31');
INSERT INTO coupons (code, discount_type, discount_value, expires_at) VALUES
('WELCOME10', 'percent', 10, '2026-12-31');
INSERT INTO coupons (code, discount_type, discount_value, expires_at) VALUES
('DOLLAR5', 'fixed', 5, '2026-12-31');
INSERT INTO coupons (code, discount_type, discount_value, expires_at) VALUES
('GLAM15', 'percent', 15, '2026-12-31');






