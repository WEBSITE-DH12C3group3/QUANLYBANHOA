SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS=0;

-- ---------------------------
-- Table: feature (chucnang)
-- ---------------------------
DROP TABLE IF EXISTS `feature`;
CREATE TABLE `feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(5) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `screen_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_feature_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_feature_ai AFTER INSERT ON feature
FOR EACH ROW BEGIN
  UPDATE feature
    SET code = CONCAT('CN', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: customer (khachhang)
-- ---------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_customer_ai AFTER INSERT ON customer
FOR EACH ROW BEGIN
  UPDATE customer
    SET code = CONCAT('KH', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: supplier (nhacungcap)
-- ---------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_supplier_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_supplier_ai AFTER INSERT ON supplier
FOR EACH ROW BEGIN
  UPDATE supplier
    SET code = CONCAT('NCC', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: product_category (loaisanpham)
-- ---------------------------
DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_category_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_product_category_ai AFTER INSERT ON product_category
FOR EACH ROW BEGIN
  UPDATE product_category
    SET code = CONCAT('LSP', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: product (sanpham)
-- ---------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(5) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `sold` int(11) DEFAULT 0,
  `color` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_code` (`code`),
  KEY `fk_product_supplier` (`supplier_id`),
  KEY `fk_product_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_product_ai AFTER INSERT ON product
FOR EACH ROW BEGIN
  UPDATE product
    SET code = CONCAT('SP', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: app_user (nguoidung)
-- ---------------------------
DROP TABLE IF EXISTS `app_user`;
CREATE TABLE `app_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_group_id` int(11) NOT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `employee_code` varchar(6) DEFAULT NULL,
  `base_salary` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`),
  UNIQUE KEY `uk_user_code` (`code`),
  UNIQUE KEY `uk_user_employee` (`employee_code`),
  KEY `fk_user_group` (`user_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_app_user_ai AFTER INSERT ON app_user
FOR EACH ROW BEGIN
  UPDATE app_user
    SET code = CONCAT('ND', LPAD(NEW.id, 4, '0')),
        employee_code = CONCAT('NV', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: user_group (nhomnguoidung)
-- ---------------------------
DROP TABLE IF EXISTS `user_group`;
CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_group_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_user_group_ai AFTER INSERT ON user_group
FOR EACH ROW BEGIN
  UPDATE user_group
    SET code = CONCAT('NND', LPAD(NEW.id, 3, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: invoice (hoadon)
-- ---------------------------
DROP TABLE IF EXISTS `invoice`;
CREATE TABLE `invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoice_code` (`code`),
  KEY `fk_invoice_customer` (`customer_id`),
  KEY `fk_invoice_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_invoice_ai AFTER INSERT ON invoice
FOR EACH ROW BEGIN
  UPDATE invoice
    SET code = CONCAT('HD', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: invoice_item (chitiethoadon)
-- ---------------------------
DROP TABLE IF EXISTS `invoice_item`;
CREATE TABLE `invoice_item` (
  `invoice_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`invoice_id`,`product_id`),
  KEY `fk_invoice_item_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------
-- Table: purchase_order (phieunhap)
-- ---------------------------
DROP TABLE IF EXISTS `purchase_order`;
CREATE TABLE `purchase_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) DEFAULT NULL,
  `received_at` datetime NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_po_code` (`code`),
  KEY `fk_po_supplier` (`supplier_id`),
  KEY `fk_po_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER trg_purchase_order_ai AFTER INSERT ON purchase_order
FOR EACH ROW BEGIN
  UPDATE purchase_order
    SET code = CONCAT('PN', LPAD(NEW.id, 4, '0'))
  WHERE id = NEW.id;
END$$
DELIMITER ;

-- ---------------------------
-- Table: purchase_order_item (chitietphieunhap)
-- ---------------------------
DROP TABLE IF EXISTS `purchase_order_item`;
CREATE TABLE `purchase_order_item` (
  `purchase_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`purchase_order_id`,`product_id`),
  KEY `fk_po_item_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------
-- Table: group_permission (phanquyen)
-- ---------------------------
DROP TABLE IF EXISTS `group_permission`;
CREATE TABLE `group_permission` (
  `user_group_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  PRIMARY KEY (`user_group_id`,`feature_id`),
  KEY `fk_gp_feature` (`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------
-- Table: system_param (thamso)
-- ---------------------------
DROP TABLE IF EXISTS `system_param`;
CREATE TABLE `system_param` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `min_stock` int(11) NOT NULL,
  `discount_rate` decimal(5,2) DEFAULT 0.00,
  `warranty_months` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------
-- Foreign Keys
-- ---------------------------
ALTER TABLE `invoice_item`
  ADD CONSTRAINT fk_invoice_item_invoice FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_invoice_item_product FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `purchase_order_item`
  ADD CONSTRAINT fk_po_item_order FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT fk_po_item_product FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

ALTER TABLE `invoice`
  ADD CONSTRAINT fk_invoice_customer FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_invoice_user FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `app_user`
  ADD CONSTRAINT fk_user_group FOREIGN KEY (`user_group_id`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `group_permission`
  ADD CONSTRAINT fk_gp_feature FOREIGN KEY (`feature_id`) REFERENCES `feature` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_gp_user_group FOREIGN KEY (`user_group_id`) REFERENCES `user_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `purchase_order`
  ADD CONSTRAINT fk_po_supplier FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_po_user FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `product`
  ADD CONSTRAINT fk_product_category FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_product_supplier FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
