-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.43 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.12.0.7122
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for inventory_system
CREATE DATABASE IF NOT EXISTS `inventory_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `inventory_system`;

-- Dumping structure for table inventory_system.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inventory_system.categories: ~0 rows (approximately)
INSERT INTO `categories` (`id`, `pid`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, '1088c9b2-227d-49fe-a5a1-5344aeee1536', 'test@gmail.com', NULL, '2026-03-27 05:29:31', NULL),
	(2, '59d0b14f-7343-4a90-a957-bc2e96d7490c', 'testds@gmail.com', 'tesdst', '2026-03-27 05:31:07', NULL);

-- Dumping structure for table inventory_system.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `cost_price` decimal(20,6) DEFAULT NULL,
  `retail_price` decimal(20,6) DEFAULT NULL,
  `reorder_level` int DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_products_categories` (`category_id`),
  KEY `FK_products_suppliers` (`supplier_id`),
  CONSTRAINT `FK_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_products_suppliers` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inventory_system.products: ~0 rows (approximately)
INSERT INTO `products` (`id`, `pid`, `sku`, `name`, `category_id`, `supplier_id`, `cost_price`, `retail_price`, `reorder_level`, `stock_quantity`, `expiry_date`, `created_at`, `updated_at`) VALUES
	(1, 'b31421f5-918d-4bea-a98b-eb799276ff11', 'dsad', '2ds', 2, 3, 22.120000, 22.200000, 1, 2, '2026-02-03', '2026-03-27 09:19:43', NULL);

-- Dumping structure for table inventory_system.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT '0',
  `contact_person` varchar(255) NOT NULL DEFAULT '0',
  `phone` varchar(255) NOT NULL DEFAULT '0',
  `email` varchar(255) NOT NULL DEFAULT '0',
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inventory_system.suppliers: ~0 rows (approximately)
INSERT INTO `suppliers` (`id`, `pid`, `name`, `contact_person`, `phone`, `email`, `address`, `created_at`, `updated_at`) VALUES
	(3, '7c6b5f1c-361b-49e1-8131-6b192e218093', 'da', 'ads', '0912312353', 'Adsasd', 'dasda', '2026-03-27 06:36:42', '0000-00-00 00:00:00'),
	(4, 'ca04aafa-2116-4d3f-9d4a-b01ee4c38e62', 'das', 'ads', '0912312353', 'Adsasd', 'dasda', '2026-03-27 06:37:14', '0000-00-00 00:00:00');

-- Dumping structure for table inventory_system.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` longtext,
  `contact_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inventory_system.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `pid`, `first_name`, `last_name`, `email`, `password`, `contact_number`, `created_at`, `updated_at`) VALUES
	(1, 'qwe', 'Test', 'To', 'admin@gmail.com', NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
