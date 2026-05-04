-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    stock INTEGER
);

-- إضافة بيانات أولية عشان تجرب بيها
INSERT INTO products (name, price, stock) VALUES 
('Milk', 30.00, 50),
('Bread', 10.00, 100),
('Eggs (30pcs)', 120.00, 20),
('Cheese', 85.50, 15);