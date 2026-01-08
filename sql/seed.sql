-- ============================================
-- RESTAUS - Seed Data
-- ============================================

USE restaus_db;

-- Insert demo users (password is plain text for demo - NOT SECURE!)
INSERT INTO users (username, password_hash, role, full_name) VALUES
('admin', 'admin123', 'admin', 'Administrator'),
('waiter', 'waiter123', 'waiter', 'John Waiter'),
('kitchen', 'kitchen123', 'kitchen', 'Chef Mike'),
('cashier', 'cashier123', 'cashier', 'Sarah Cashier');

-- Insert categories
INSERT INTO categories (name, icon, sort_order) VALUES
('Makanan Berat', 'UtensilsCrossed', 1),
('Minuman', 'Coffee', 2),
('Dessert', 'IceCream', 3);

-- Insert sample menus
INSERT INTO menus (category_id, name, description, price, is_active) VALUES
-- Makanan Berat
(1, 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran', 25000, TRUE),
(1, 'Mie Goreng', 'Mie goreng dengan sayuran segar', 20000, TRUE),
(1, 'Ayam Bakar', 'Ayam bakar bumbu kecap dengan nasi', 35000, TRUE),
(1, 'Soto Ayam', 'Soto ayam kuning dengan nasi', 22000, TRUE),
(1, 'Gado-Gado', 'Sayuran dengan bumbu kacang', 18000, TRUE),

-- Minuman
(2, 'Es Teh Manis', 'Teh manis dingin', 5000, TRUE),
(2, 'Es Jeruk', 'Jus jeruk segar', 8000, TRUE),
(2, 'Kopi Hitam', 'Kopi hitam panas', 10000, TRUE),
(2, 'Cappuccino', 'Kopi dengan susu foam', 15000, TRUE),
(2, 'Jus Alpukat', 'Jus alpukat segar', 12000, TRUE),

-- Dessert
(3, 'Es Krim Vanilla', 'Es krim vanilla premium', 15000, TRUE),
(3, 'Pisang Goreng', 'Pisang goreng crispy', 10000, TRUE),
(3, 'Pudding Coklat', 'Pudding coklat lembut', 12000, TRUE);

-- Insert inventories for all menus (daily stock = 50)
INSERT INTO inventories (menu_id, daily_stock, remaining_stock)
SELECT id, 50, 50 FROM menus;

-- Insert sample tables
INSERT INTO tables (table_number, capacity, status) VALUES
('T01', 2, 'available'),
('T02', 4, 'available'),
('T03', 4, 'available'),
('T04', 6, 'available'),
('T05', 2, 'available'),
('T06', 8, 'available'),
('T07', 4, 'available'),
('T08', 2, 'available'),
('T09', 6, 'available'),
('T10', 4, 'available');

-- Sample completed order (for testing history)
INSERT INTO orders (table_id, user_id, order_type, status, total_amount, created_at) VALUES
(1, 2, 'dine_in', 'completed', 55000, DATE_SUB(NOW(), INTERVAL 1 HOUR));

SET @last_order_id = LAST_INSERT_ID();

INSERT INTO order_items (order_id, menu_id, quantity, price_at_time, special_notes, status) VALUES
(@last_order_id, 1, 2, 25000, 'Pedas sedang', 'served'),
(@last_order_id, 6, 2, 5000, NULL, 'served');

INSERT INTO payments (order_id, cashier_id, payment_method, amount_paid, change_amount, transaction_date) VALUES
(@last_order_id, 4, 'cash', 60000, 5000, DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Reset table status
UPDATE tables SET status = 'available' WHERE id = 1;
