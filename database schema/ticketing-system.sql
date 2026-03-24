-- --------------------------------------------------------
-- Host:                         72.61.119.114
-- Server version:               8.0.44-0ubuntu0.24.04.2 - (Ubuntu)
-- Server OS:                    Linux
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


-- Dumping database structure for ticketing-system
CREATE DATABASE IF NOT EXISTS `ticketing-system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ticketing-system`;

-- Dumping structure for table ticketing-system.applicants
CREATE TABLE IF NOT EXISTS `applicants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` varchar(50) DEFAULT NULL,
  `full_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `job_number` varchar(50) DEFAULT NULL,
  `status` enum('NEW_APPLICANT','SHORTLISTED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_rejected` tinyint DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.applicants: ~17 rows (approximately)
INSERT INTO `applicants` (`id`, `pid`, `full_name`, `email`, `phone`, `position`, `job_number`, `status`, `is_rejected`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(35, '1e32a29c-1c5e-4867-b8e6-e10e18946114', 'Jacob Baldonado', 'jacobbaldonado551@gmail.com', '09368670668', 'Sales Marketing', 'BSG2026677', 'REJECTED', 1, 0, '2026-02-18 08:21:36', NULL),
	(36, '251c9c2c-4c3a-45ba-9005-a2101f4d82ec', 'Alexandra Philline N. Targa', 'alexandraphilline@gmail.com', '09923306641', 'Sales Marketing', 'BSG2026677', 'REJECTED', 1, 0, '2026-02-18 08:23:06', NULL),
	(37, '7f8d01f2-dc43-4b75-b897-3645fb33377c', 'Maxine Crystelle D. Castro ', 'castromaxine868@gmail.com', '09063321369', 'Sales Marketing', 'BSG2026677', 'REJECTED', 1, 0, '2026-02-18 09:42:25', NULL),
	(38, '51fb95fa-9de6-455d-902f-ef135720e11f', 'Decibar, Laurenzo P. ', 'decibarlaurenzo@gmail.com', '09626799878', 'Sales Graphic', 'BSG2026499', 'REJECTED', 1, 0, '2026-02-19 10:59:17', NULL),
	(39, '624342ae-5ff8-4cf4-acc8-c14a523432b9', 'Dezaree M. Felia', 'dezm614@gmail.com', '09260531781', 'Sales Marketing', 'BSG2026677', 'REJECTED', 1, 0, '2026-02-20 02:50:01', NULL),
	(40, '0993a26c-a9db-4573-9787-6e1095c2d306', 'MA. CHRISTINE DEL ROSARIO', 'machristinedelrosario@gmail.com', '09683701529', 'Sales Marketing', 'BSG2026677', 'SHORTLISTED', 0, 0, '2026-02-27 06:17:56', NULL),
	(41, '96e30644-4692-4e33-a7d1-107275fb6b25', 'ERICKA MAE ALEJO', 'mmaealejo@gmail.co', '09279180282', 'Sales Marketing', 'BSG2026677', 'REJECTED', 0, 0, '2026-02-27 08:26:22', NULL),
	(42, '0bfbc77b-1820-4008-90d8-fe67e00b9034', 'Cherlyn Ann Talon', 'shrlntalon@gmail.com', '09625065104', 'Sales Marketing', 'BSG2026677', 'REJECTED', 1, 0, '2026-02-28 05:39:08', NULL),
	(43, 'ec140aa1-da00-4834-ab13-52971ce58fb5', 'Harold De la Cruz', 'hrldphysics@icloud.com', '09496860902', 'Sales Marketing', 'BSG2026677', 'REJECTED', 0, 0, '2026-03-11 09:24:30', NULL),
	(44, 'bfd94513-d0ad-4240-8d90-1db219871c2a', 'Julianne Hazel Epe', 'epejuliannehazel@gmail.com', '09189472015', 'Sales Marketing', 'BSG2026677', 'SHORTLISTED', 0, 0, '2026-03-11 09:26:28', NULL),
	(45, 'fe042651-89d5-45dc-907d-76196777bd8d', 'Bianca Denise Ondoy', 'ondoybianca01@gmail.com', '09241243014', 'Sales Marketing', 'BSG2026677', 'SHORTLISTED', 0, 0, '2026-03-11 10:17:09', NULL),
	(46, '0f7522f8-157c-4ba8-be7d-94826377a84c', 'GAIL P. MARISTELA', 'gailmaristela8@gmail.com', '09517403774', 'Sales Marketing', 'BSG2026677', 'SHORTLISTED', 0, 0, '2026-03-12 01:05:40', NULL),
	(47, 'ff1cfbf2-4cf4-478c-8430-6a2230193320', 'CRISCEL T. GUIRA', 'guiracriscel@gmail.com', '09624179401', 'Sales Marketing', 'BSG2026677', 'REJECTED', 0, 0, '2026-03-12 08:58:38', NULL),
	(48, '350fc371-6cca-4acd-8da2-59c3ccd980b4', 'DIANA JESBEL L. CUAZON', 'dianajesbel@gmail.com', '09624253739', 'Sales Marketing', 'BSG2026677', 'SHORTLISTED', 0, 0, '2026-03-13 08:25:08', NULL),
	(49, '9e0ead3a-32ea-4b23-961c-23aa21498e43', 'JEREMI JOSH V. VILLANUEVA', 'jshvillanueva27@gmail.com', '09168930172', 'Sales Marketing', 'BSG2026677', 'NEW_APPLICANT', 0, 0, '2026-03-16 01:17:48', NULL),
	(50, 'dc6fda61-f1c8-4d3f-bea8-699ffd52f2a7', 'Matt Fredric L. Liao', 'mflliao88@gmail.com', '09957263232', 'Sales Marketing', 'BSG2026677', 'NEW_APPLICANT', 0, 0, '2026-03-16 01:19:41', NULL),
	(51, '67cc8847-ce3a-47de-93bd-d7c521a9c9b6', '  CAMASO, URIECHIEL B. ', 'camaso.uriechiel@gmail.com', '09398132562', 'Sales Marketing', 'BSG2026677', 'NEW_APPLICANT', 0, 0, '2026-03-16 02:31:44', NULL);

-- Dumping structure for table ticketing-system.applicants_attachment
CREATE TABLE IF NOT EXISTS `applicants_attachment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicants_id` int DEFAULT NULL,
  `attachment_url` longtext,
  `file_name` longtext,
  `file_size` longtext,
  `file_type` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_applicants_attachment_applicants` (`applicants_id`),
  CONSTRAINT `FK_applicants_attachment_applicants` FOREIGN KEY (`applicants_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.applicants_attachment: ~17 rows (approximately)
INSERT INTO `applicants_attachment` (`id`, `applicants_id`, `attachment_url`, `file_name`, `file_size`, `file_type`, `created_at`, `updated_at`) VALUES
	(32, 35, 'https://rgfs.bryansurio.workers.dev/applicant/0d551aa1-47d4-479b-9cee-d644a63c9420.pdf', NULL, NULL, NULL, '2026-02-18 08:21:36', NULL),
	(33, 36, 'https://rgfs.bryansurio.workers.dev/applicant/4f2bb19f-8008-47c1-ac99-3a78b6d2640a.pdf', NULL, NULL, NULL, '2026-02-18 08:23:06', NULL),
	(34, 37, 'https://rgfs.bryansurio.workers.dev/applicant/db8e131e-a22b-4c25-a4d1-0291f48b7e59.pdf', NULL, NULL, NULL, '2026-02-18 09:42:25', NULL),
	(35, 38, 'https://rgfs.bryansurio.workers.dev/applicant/7088ffbd-7e6c-457f-a142-ac91943ee857.pdf', NULL, NULL, NULL, '2026-02-19 10:59:17', NULL),
	(36, 39, 'https://rgfs.bryansurio.workers.dev/applicant/e75aa025-1562-429e-98ee-2e3324840f4c.pdf', NULL, NULL, NULL, '2026-02-20 02:50:02', NULL),
	(37, 40, 'https://rgfs.bryansurio.workers.dev/applicant/acebbecd-92da-471b-abcc-9c0fb70006cf.pdf', 'inbound3019913722899864971.pdf', '287398', 'application/pdf', '2026-02-27 06:17:56', NULL),
	(38, 41, 'https://rgfs.bryansurio.workers.dev/applicant/c0894953-f1af-49b8-bf09-97378c3d7ce7.pdf', 'alejo-resume.pdf', '54085', 'application/pdf', '2026-02-27 08:26:23', NULL),
	(39, 42, 'https://rgfs.bryansurio.workers.dev/applicant/2eeef2c7-421e-4316-97e8-27715ce8d119.pdf', 'inbound672882057869138008.pdf', '175719', 'application/pdf', '2026-02-28 05:39:09', NULL),
	(40, 43, 'https://rgfs.bryansurio.workers.dev/applicant/a8a02a7f-5ca9-41e8-ac25-6ed163920d92.pdf', 'cid_5A7BB2FD-DB7E-4251-9774-5E49A4D91B32.pdf', '139059', 'application/pdf', '2026-03-11 09:24:30', NULL),
	(41, 44, 'https://rgfs.bryansurio.workers.dev/applicant/548e49cd-d71a-4c07-ac16-99fceca81124.pdf', 'CV_jhe.pdf', '64755', 'application/pdf', '2026-03-11 09:26:28', NULL),
	(42, 45, 'https://rgfs.bryansurio.workers.dev/applicant/52c856be-e14e-4beb-b57a-6af0a73ede83.pdf', 'Ondoy, Bianca Denise.pdf', '3944227', 'application/pdf', '2026-03-11 10:17:11', NULL),
	(43, 46, 'https://rgfs.bryansurio.workers.dev/applicant/e6525a66-b2ae-4630-aadc-14ccce1f539e.pdf', 'MARISTELA, GAIL.pdf', '255074', 'application/pdf', '2026-03-12 01:05:41', NULL),
	(44, 47, 'https://rgfs.bryansurio.workers.dev/applicant/be67fb4c-44ef-43f5-af71-05a44f99ebb3.pdf', 'Criscel T. Guira_Resume (Marketing Staff _ Associate).pdf', '93723', 'application/pdf', '2026-03-12 08:58:38', NULL),
	(45, 48, 'https://rgfs.bryansurio.workers.dev/applicant/0cd26ebe-2cf5-475b-ae8b-3929be04af87.pdf', 'Resume - Diana Cuazon.pdf', '63567', 'application/pdf', '2026-03-13 08:25:08', NULL),
	(46, 49, 'https://rgfs.bryansurio.workers.dev/applicant/8e89cf59-7a93-48eb-aa96-dc6e3adc1e06.pdf', 'VILLANUEVA RESUME.pdf', '115142', 'application/pdf', '2026-03-16 01:17:49', NULL),
	(47, 50, 'https://rgfs.bryansurio.workers.dev/applicant/136b5808-0258-4e45-b4b0-7feb210c52d2.pdf', 'LIAO, Matt.pdf', '737346', 'application/pdf', '2026-03-16 01:19:41', NULL),
	(48, 51, 'https://rgfs.bryansurio.workers.dev/applicant/57d95973-1a34-445f-856b-aa57a373db15.pdf', 'Camaso Resume_SMM.pdf', '190060', 'application/pdf', '2026-03-16 02:31:45', NULL);

-- Dumping structure for table ticketing-system.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` longtext,
  `entity` longtext,
  `details` longtext,
  `status_message` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_audit_logs_users` (`user_id`),
  CONSTRAINT `FK_audit_logs_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.audit_logs: ~25 rows (approximately)
INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity`, `details`, `status_message`, `created_at`) VALUES
	(1, 25, 'Login', 'Authentication', 'User Thinz Calizar logged in.', 'Login Successfully', '2026-03-18 01:57:17'),
	(2, 21, 'Login', 'Authentication', 'User Dexter Jamero logged in.', 'Login Successfully', '2026-03-18 02:05:19'),
	(3, 25, 'Create', 'Position', 'Position created: Tester.', 'Position created successfully.', '2026-03-18 02:07:04'),
	(4, 25, 'Update', 'User', 'User account updated for Dexter Jamero.', 'User Updated Successfully', '2026-03-18 02:08:17'),
	(5, 21, 'Logout', 'Authentication', 'Dexter Jamero logged out.', 'Logout Successfully', '2026-03-18 02:09:08'),
	(6, 21, 'Login', 'Authentication', 'User Dexter Jamero logged in.', 'Login Successfully', '2026-03-18 02:09:20'),
	(7, 18, 'Login', 'Authentication', 'User RD Abuan logged in.', 'Login Successfully', '2026-03-18 02:29:26'),
	(8, 25, 'Logout', 'Authentication', 'Thinz Calizar logged out.', 'Logout Successfully', '2026-03-18 02:45:29'),
	(9, 25, 'Login', 'Authentication', 'User Thinz Calizar logged in.', 'Login Successfully', '2026-03-18 02:45:47'),
	(10, 18, 'Reply', 'Ticket', 'Replied to a ticket.', 'Successfully replied to a ticket.', '2026-03-18 09:09:04'),
	(11, 25, 'Logout', 'Authentication', 'Thinz Calizar logged out.', 'Logout Successfully', '2026-03-18 11:26:43'),
	(12, 25, 'Login', 'Authentication', 'User Thinz Calizar logged in.', 'Login Successfully', '2026-03-18 11:26:57'),
	(13, 21, 'Logout', 'Authentication', 'Dexter Jamero logged out.', 'Logout Successfully', '2026-03-18 14:33:35'),
	(14, 21, 'Login', 'Authentication', 'User Dexter Jamero logged in.', 'Login Successfully', '2026-03-19 02:00:17'),
	(15, 25, 'Login', 'Authentication', 'User Thinz Calizar logged in.', 'Login Successfully', '2026-03-19 02:44:13'),
	(16, 25, 'Update', 'Issue', 'Issue updated: ‎ Others.', 'Issue updated successfully.', '2026-03-19 02:56:18'),
	(17, 25, 'Update', 'Issue', 'Issue updated: ‎ Others.', 'Issue updated successfully.', '2026-03-19 02:57:36'),
	(18, 26, 'Login', 'Authentication', 'User Elle Guevarra logged in.', 'Login Successfully', '2026-03-19 03:00:09'),
	(19, 26, 'Update Status', 'Applicants', 'Applicant status updated to REJECTED.', 'Applicant status updated to REJECTED.', '2026-03-19 03:00:59'),
	(20, 26, 'Update Status', 'Applicants', 'Applicant status updated to REJECTED.', 'Applicant status updated to REJECTED.', '2026-03-19 03:01:03'),
	(21, 25, 'Update', 'Issue', 'Issue updated: Android Not Working.', 'Issue updated successfully.', '2026-03-19 03:08:30'),
	(22, 25, 'Update', 'Issue', 'Issue updated: Black Screen.', 'Issue updated successfully.', '2026-03-19 03:09:37'),
	(23, 25, 'Update', 'Issue', 'Issue updated: Android Not Working.', 'Issue updated successfully.', '2026-03-19 03:11:28'),
	(24, 25, 'Update', 'Issue', 'Issue updated: Black Screen.', 'Issue updated successfully.', '2026-03-19 03:11:37'),
	(25, 25, 'Update', 'Issue', 'Issue updated: ‎ Others.', 'Issue updated successfully.', '2026-03-19 03:12:28');

-- Dumping structure for table ticketing-system.careers
CREATE TABLE IF NOT EXISTS `careers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_reference_number` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `job_type` enum('Full-time','Internship','Part-time','Contract') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `work_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `careers_job_details` longtext,
  `status` enum('Accepting_Applications','Closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.careers: ~2 rows (approximately)
INSERT INTO `careers` (`id`, `job_reference_number`, `description`, `title`, `job_type`, `location`, `work_location`, `careers_job_details`, `status`, `created_at`, `updated_at`) VALUES
	(16, 'BSG2026499', '<ul style="list-style-type: disc; padding-left: 40px;"><li>You will create visual content and marketing materials that help promote our tech products and services.&nbsp;<span style="font-size: 0.875rem;">You will also support the sales team by creating presentations and visuals for clients.</span></li></ul><div><br></div>', 'Sales Graphic', 'Full-time', 'South Triangle, Quezon City', 'Onsite', '<div><div><b>Key Responsibilities</b></div></div><div><b><br></b></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Design visuals for social media, ads, and campaigns</li><li>Prepare marketing materials and support sales presentations and campaign visuals</li><li>Join trade shows, demos, and marketing events when needed</li></ul></div><div><br></div><div><b>Qualifications</b></div><div><b><br></b></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Graduate of Graphic Design, Multimedia, Marketing, IT, or related field</li><li>Experience in design, marketing, or sales is a plus.</li><li>Skilled in Photoshop, Illustrator, Canva (Meta/Google Ads knowledge is a plus)</li></ul></div>', 'Accepting_Applications', '2026-01-14 05:53:56', NULL),
	(25, 'BSG2026677', 'Drive lead generation and strategic marketing initiatives while building strong client relationships to expand our market reach and connect businesses with the right tech and IT solutions.', 'Sales Marketing', 'Full-time', 'South Triangle, Quezon City', 'Onsite', '<div><b>Key Responsibilities</b></div><div><br></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Plan, execute and research marketing strategies and trends to identify potential clients.</li><li>Support campaigns, presentations, and promotional materials while coordinating with the technical team.</li><li>Attend client meetings, demos, and events; prepare basic reports and marketing documents.</li></ul></div><div><br></div><div><b>Qualifications</b></div><div><br></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Bachelor’s degree in business, Marketing, IT, or related field; experience in Sales or Marketing is an advantage.</li><li>Strong communication, presentation, and MS Office skills (Word, Excel, PowerPoint).</li><li>Organized, proactive, and willing to learn; knowledge in digital marketing is a plus.</li></ul></div>', 'Accepting_Applications', '2026-01-19 02:37:56', NULL);

-- Dumping structure for table ticketing-system.careers_qualifications
CREATE TABLE IF NOT EXISTS `careers_qualifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `careers_id` int DEFAULT NULL,
  `qualification` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_careers_qualifications_careers` (`careers_id`),
  CONSTRAINT `FK_careers_qualifications_careers` FOREIGN KEY (`careers_id`) REFERENCES `careers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.careers_qualifications: ~0 rows (approximately)

-- Dumping structure for table ticketing-system.careers_responsibilities
CREATE TABLE IF NOT EXISTS `careers_responsibilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `careers_id` int DEFAULT NULL,
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_careers_responsibilities_careers` (`careers_id`),
  CONSTRAINT `FK_careers_responsibilities_careers` FOREIGN KEY (`careers_id`) REFERENCES `careers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.careers_responsibilities: ~0 rows (approximately)

-- Dumping structure for table ticketing-system.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `is_active` enum('true','false') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'false',
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.categories: ~5 rows (approximately)
INSERT INTO `categories` (`id`, `pid`, `name`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(6, 'cf8e1198-c46f-4ca4-8558-9819e7d3e289', 'Educational Tablet', 'false', 0, '2025-11-20 02:35:09', '2026-02-06 07:24:29'),
	(7, '03bb14fd-effc-4896-a948-7a7ad8220f73', 'Educational Interactive TV', 'false', 0, '2025-11-20 02:35:19', '2026-02-06 07:05:12'),
	(21, '05d39281-a463-4205-afa8-9b838f7b06ba', 'Others', 'true', 0, '2025-11-20 02:34:01', '2026-02-25 06:25:21'),
	(22, 'cb6fb376-a0b0-4971-b790-267f606be43b', 'Uninterrupted Power Supply (UPS)', 'false', 0, '2026-02-06 07:39:57', '2026-02-06 07:42:37'),
	(23, '4c31d305-7ceb-4950-b143-5a3d54c24ab1', 'Network System', 'false', 0, '2026-02-12 07:04:46', NULL);

-- Dumping structure for table ticketing-system.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `company` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.customers: ~38 rows (approximately)
INSERT INTO `customers` (`id`, `pid`, `full_name`, `company`, `city`, `email`, `phone`, `location`, `created_at`) VALUES
	(157, 'd2360ddf-9fcb-4719-a16d-f0ee7413ccf0', 'Elizabeth Guevarra', 'BSG Technologies', 'Quezon City', 'elizabeth.guevarra@beesee.ph', '09678019117', NULL, '2026-01-08 08:52:26'),
	(200, 'b7b4591c-9600-4ac2-913a-5dc8c17bcadd', 'Maria Anne Mestica', 'San Isidro National High School', 'Makati', 'mariaanne.mestica@deped.gov.ph', '09227027397', NULL, '2026-02-12 06:05:48'),
	(201, 'ab62411a-8d42-4595-84ac-1b553de2c74a', 'Rizza Joy Alido', 'Nicanor C. Garcia Sr. Elementary School', 'CITY OF MAKATI', 'rizzajoy.alido@depedmakati.ph', '09705185992', NULL, '2026-02-12 06:45:34'),
	(202, '3c9e57cf-f44a-41b5-a108-6cc2c2cd3391', 'Maria Criselda G. Bautista', 'Hen Pio Del Pilar Elementary School - Main', 'Makati ', 'mariacriselda.bautista@deped.gov.ph', '09084074556', NULL, '2026-02-12 09:35:38'),
	(203, 'df89e334-b5a6-4970-a8e2-e3228fb6b30b', 'Marielle Buendia', 'Hen. Pio Del Pilar Elementary School I', 'Makati City', 'marielle.buendia@depedmakati.ph', '09156846007', NULL, '2026-02-13 07:26:57'),
	(204, 'ac1ee8bc-d238-4ba9-9fe5-688f69e6a3ab', 'Shiela Mae Roson', 'Hen. Pio del Pilar Elementary School Main', 'Makati', 'shielamae.roson@deped.gov.ph', '09351623970', NULL, '2026-02-13 07:48:48'),
	(205, '47b9e652-da72-472b-a4e4-14fa86b5a7e5', 'Marielle Buendia', 'Hen. Pio Del Pilar Elementary School I', 'Makati City', 'marielle.buendia@depedmakati.ph', '09156846007', NULL, '2026-02-13 08:07:48'),
	(206, 'c94370ad-7517-4d10-aaf2-a02779f02b8b', 'Marielle Buendia', 'Hen. Pio Del Pilar Elementary School I', 'Makati City', 'marielle.buendia@depedmakati.ph', '09156846007', NULL, '2026-02-13 08:08:49'),
	(207, '3511af5c-a4d6-4397-a633-be99e4c6f8f2', 'Krizza Herrella', 'Makati High School', 'Makati', 'krizzajoy.herrella@deped.gov.ph', '09173104799', NULL, '2026-02-18 01:51:35'),
	(208, '472863a4-7f50-4147-80e6-1f85f52b39a9', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:18:20'),
	(209, '290c8369-97bc-4089-afca-5ea86ebd35b7', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:19:32'),
	(210, '2fb09bc9-b04e-4c4c-a863-92a21bfec204', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:23:31'),
	(211, 'd32ab6cb-3ad4-4a24-8b76-5b548dc09e03', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:24:25'),
	(212, '719166fb-4999-4e7c-a4d3-214d755b085c', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:26:00'),
	(213, '3477d594-3570-4516-b19f-044242fd95ff', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:26:49'),
	(214, '99999374-ad45-48cf-8b72-d18dfd879923', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:28:02'),
	(215, 'f9fe7e34-93d9-45e2-b4bf-9e9cfb0db5ac', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:30:18'),
	(216, '4a903d19-b509-4a66-88c2-de9cabef1c9d', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:35:22'),
	(217, '7b7cabb6-6f63-43e0-8cd9-e01ff5d564c0', 'Rica Mae E. Villacorta', 'LA PAZ ELEMENTARY SCHOOL', 'Manila', 'ricamae.villacorta@deped.gov.ph', '09650842964', NULL, '2026-02-18 07:47:03'),
	(218, '5d8bf850-a73b-4c4d-ad3f-fd0e8b1ad887', 'RUBY ANICIETE', 'NEMESIO I. YABUT SHS', 'Makati City', 'rubyaniciete@yahoo.com', '09167253562', NULL, '2026-02-18 08:33:46'),
	(219, 'f354e9c1-54b3-47d4-b4a0-11c004803230', 'Mary Grace Elle', 'Gen Pio Del Pilar National High School', 'Makati City', 'marygrace.elle001@deped.gov.ph', '09176385797', NULL, '2026-02-19 02:24:21'),
	(220, 'fd956789-7f31-4353-874a-f3f4ee7015dd', 'Kevin P. Bunagan', 'Makati Integrated School', 'Makati', 'kevin.bunagan@deped.gov.ph', '09684529650', NULL, '2026-02-19 07:07:25'),
	(221, '24e01239-3280-476e-b0ce-396f29eb0e5c', 'Kevin P. Bunagan', 'Makati Integrated School', 'Makati City', '136690@deped.gov.ph', '09394592895', NULL, '2026-02-19 07:07:55'),
	(222, 'cf18a678-8cc7-4c98-84b0-b23debfe7081', 'KRIZZA BUCIA', 'MAKATI HIGH SCHOOL', 'CITY OF MAKATI', '305406@DEPED.GOV.PH', '09173104799', NULL, '2026-02-19 07:36:09'),
	(223, 'fdc0fb09-ec9e-4042-8a53-e25d3ae28240', 'KRIZZA BUCIA', 'MAKATI HIGH SCHOOL', 'CITY OF MAKATI', '305406@DEPED.GOV.PH', '09173104799', NULL, '2026-02-19 07:38:23'),
	(224, '09f8660e-376e-4e78-9c2b-1afc2ac9e8c7', 'KRIZZA BUCIA', 'MAKATI HIGH SCHOOL', 'CITY OF MAKATI', '305406@DEPED.GOV.PH', '09173104799', NULL, '2026-02-19 07:39:14'),
	(225, 'bd8c8a19-c022-43fd-b29e-93342d88a51a', 'Jenelyn Agbay', 'San Antonio National High School', 'CITY OF MAKATI', 'jenelynaagbay@gmail.com', '09475177590', NULL, '2026-02-20 03:42:51'),
	(226, 'b30a5f8f-c049-4703-8680-d35b37fdc220', 'Jenelyn Agbay', 'San Antonio National High School', 'CITY OF MAKATI', 'jenelynaagbay@gmail.com', '09475177590', NULL, '2026-02-20 03:50:15'),
	(227, '87abff56-b028-4e93-a1f9-6376715a9e8b', 'Jenelyn Agbay', 'San Antonio National High School', 'CITY OF MAKATI', 'jenelynaagbay@gmail.com', '09475177590', NULL, '2026-02-20 03:50:27'),
	(228, '8210d53e-67c8-46f7-996b-202aa004454c', 'JUNA ASPACIO PALMISA', 'SAN JOSE  ELEMENTARY SCHOOL', 'MAKATI CITY', '136691@deped.gov.ph', '09956802913', NULL, '2026-02-20 07:14:20'),
	(229, '6ff1e30c-8305-4e99-abae-ece0805bba60', 'ROCKY LLANERA GABITANAN', 'San Antonio Village Elementary School', 'Makati City', 'rocky.gabitanan@deped.gov.ph', '09477683645', NULL, '2026-02-20 10:26:02'),
	(230, '058bb841-c11f-433b-b85c-001bbdce9816', 'Ruth at. Sabangan', 'Maximo Estrella Elementary School', 'Makati', 'sabanganruthie13@gmail.com', '09498747871', NULL, '2026-02-23 03:19:24'),
	(232, '37a11b76-84c6-46f1-bf93-567a14ccc0f1', 'Krizza Bucia', 'Makati High School', 'Makati', 'krizzajoy.herrella@deped.gov.ph', '09173104799', '409b', '2026-03-03 08:28:19'),
	(233, '29944430-3fdf-4541-930c-b4f5b6b9ec38', 'Mary Grace Elle', 'Gen Pio Del Pilar National High School', 'Makati City', 'marygrace.elle001@deped.gov.ph', '09176385797', 'Room 302', '2026-03-10 01:46:07'),
	(234, 'af445ed8-0885-4ded-a1b5-9d306234c641', 'Sheryl Modrigo', 'Makati Hgh School', 'City Of Makati', 'sheryl.modrigo@deped.gov.ph', '09173104799', '205 B', '2026-03-12 07:03:25'),
	(235, '6a35f3dc-63d2-4068-98b1-7069c30243de', 'Christian Tejada', 'Palanan Es', 'Makati', 'christian.tejada@deped.gov.ph', '09634411032', 'Palanan Es', '2026-03-13 04:18:58'),
	(236, '9d3ee054-c9a5-46c5-a893-f73cf0b5ee8c', 'Ruby Aniciete', 'Nemesio I. Yabut Shs', 'Makati City', 'rubyaniciete@yahoo.com', '09167253562', '220, 422', '2026-03-16 00:47:08'),
	(238, 'ca438d8e-b222-44df-b723-af279437ae83', 'Krizza Bucia', 'Makati High School', 'Makati', 'krizzajoy.herrella@deped.gov.ph', '09173104799', '407b', '2026-03-18 04:19:13');

-- Dumping structure for table ticketing-system.faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `explanation` longtext NOT NULL,
  `products_id` varchar(50) DEFAULT NULL,
  `categories_id` int DEFAULT NULL,
  `is_all_devices` tinyint DEFAULT '1',
  `is_deleted` tinyint DEFAULT '0',
  `issue_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_faqs_categories` (`categories_id`),
  KEY `FK_faqs_products` (`products_id`),
  KEY `FK_faqs_issues` (`issue_id`),
  CONSTRAINT `FK_faqs_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_faqs_issues` FOREIGN KEY (`issue_id`) REFERENCES `issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.faqs: ~5 rows (approximately)
INSERT INTO `faqs` (`id`, `pid`, `title`, `explanation`, `products_id`, `categories_id`, `is_all_devices`, `is_deleted`, `issue_id`, `created_at`, `updated_at`) VALUES
	(4, 'f62a2413-43c4-435c-9480-5f2c947c3bff', 'Why is my Tablet slow?', '<ul style="list-style-type: disc; padding-left: 40px;"><li>\nClose unnecessary apps\nRestart the laptop&nbsp;</li><li>Update software and clear temporary files</li></ul>', '', 6, 1, 0, NULL, '2025-11-20 02:49:57', '2026-02-25 07:40:03'),
	(17, 'ea0cd350-2960-4bd8-90d8-154dfc2644f8', 'OPS PC Not Detected', '<b>Possible Causes:\n</b><div><ul style="list-style-type: disc; padding-left: 40px;"><li>OPS module not properly inserted</li><li>BIOS or driver issue\n</li><li>Power issue\n</li></ul></div><div><b>Basic Troubleshooting:\n</b></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Reinsert the OPS module, then restart</li></ul></div><div><br></div><div>\n</div><div>\n</div>', '', 7, 1, 0, NULL, '2026-01-09 01:35:56', '2026-02-25 07:40:41'),
	(18, '66fd7b19-0269-4b99-9857-ea93ea81c4c0', 'Android System Freezes or Crashes', '<b>Possible Causes:\n</b><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Low memory\n</li><li>Too many running apps\n</li><li>Outdated firmware\n</li></ul></div><div><b>Basic Troubleshooting:\n</b></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Close unused apps\n</li><li>Restart the panel\n</li><li>Update system firmware\n</li></ul></div><div><br></div><div>\n</div><div>\n</div>', '', 7, 1, 0, NULL, '2026-01-09 01:43:35', '2026-02-25 07:40:15'),
	(19, '9aaff7ee-df06-40d8-957c-cab4ab255d07', 'Panel Won’t Power On', '\nCheck the main switch of the interactive smart panel is turned on\nCheck the power cable and outlet\nTry a different power source\nPress and hold the power button for 10 seconds', '', 7, 1, 0, NULL, '2026-01-09 01:45:26', NULL),
	(20, '1c187873-39c3-48a6-a46e-5367a32ec1e8', 'Wi-fi or Network Not Connecting', '<b>Possible Causes:\n</b><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Weak signal\n</li><li>Incorrect network settings\n</li><li>Software issue\n</li></ul></div><div><b>Basic Troubleshooting:\n</b></div><div><ul style="list-style-type: disc; padding-left: 40px;"><li>Restart router and smart panel\n</li><li>Reconnect to Wi-Fi\n</li><li>Use a LAN cable to test network\n</li><li>Reseat Wi-fi module \n</li></ul></div><div><br></div>', '', 7, 1, 0, NULL, '2026-01-09 01:48:19', '2026-02-06 03:34:58');

-- Dumping structure for table ticketing-system.inquiries
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `company` varchar(50) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `status` enum('Unsettled','Settled','Closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.inquiries: ~2 rows (approximately)
INSERT INTO `inquiries` (`id`, `pid`, `name`, `email`, `company`, `position`, `contact_number`, `status`, `created_at`) VALUES
	(45, '868c3068-65ce-4c18-a54d-51dce388bb94', 'Jesalyn L. Mayuga', 'jesalynmayuga@gmail.com', 'Colegio de Laurel', 'Librarian', '09761980337', 'Settled', '2026-03-06 05:29:59'),
	(46, '1cb1efc3-541e-4004-b676-d037f226182f', 'Jesalyn Mayuga', 'jesalynmayuga@gmail.com', 'Colegio de Laurel', 'Librarian ', '09761980337', 'Unsettled', '2026-03-09 07:07:09');

-- Dumping structure for table ticketing-system.inquiries_reply
CREATE TABLE IF NOT EXISTS `inquiries_reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_role` varchar(50) NOT NULL DEFAULT '0',
  `sender_name` varchar(50) NOT NULL DEFAULT '0',
  `subject` varchar(50) DEFAULT NULL,
  `message_body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_inbound` tinyint DEFAULT NULL,
  `inquiries_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_inquiries_reply_inquiries` (`inquiries_id`),
  CONSTRAINT `FK_inquiries_reply_inquiries` FOREIGN KEY (`inquiries_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.inquiries_reply: ~3 rows (approximately)
INSERT INTO `inquiries_reply` (`id`, `user_role`, `sender_name`, `subject`, `message_body`, `is_inbound`, `inquiries_id`, `created_at`) VALUES
	(104, 'Customer', 'Jesalyn L. Mayuga', 'TV Relocation and Stand Recommendation', 'Good day!\n\nThis is Jesalyn L. Mayuga from Colegio de Laurel, Laurel, Batangas. We are the recipients of the donated TV and tablets, which were installed in the library last September 3, 2025.\n\nI would like to ask if it would be possible to remove the TV from the wall and transfer it to a movable stand instead. If possible, could you kindly recommend a suitable movable stand and advise on the appropriate size?\n\nThank you very much and  I look forward to your response.\n\n\n\nSincerely,\n\nJesalyn L. Mayuga', 1, 45, '2026-03-06 05:29:59'),
	(105, 'SysAdmin', 'Thinz Calizar', 'TV Relocation and Stand Recommendation', 'Hello Ms. Jesalyn,\r\n\r\nGood day!\r\nRegarding your question, yes it is possible to use a movable stand. You can use the provided bracket as the same fixture to attached to the movable stand. Unfortunately, we are currently out of stock for the specific 75" Educational Interactive TV stand.\r\n\r\nI hope this clarifies your concern. If you need any further details or information, please don\'t hesitate to reach out.\r\n\r\nBest regards,\r\nBeeSee Global Technologies, Inc.', 0, 45, '2026-03-06 06:29:44'),
	(106, 'Customer', 'Jesalyn Mayuga', 'INQUIRY ABOUT TV MOVABLE STAND', 'Dear BeeSee Team,\n\nGood day.\n\nMay I kindly ask how much the movable TV stand costs? Also, could you please inform me when there is stock available again?\n\nYou may message me at my email, jesalynmayuga@gmail.com, or call/text me at 09761980337.\n\nThank you very much.\n\nSincerely,\nJesalyn Mayuga\n', 1, 46, '2026-03-09 07:07:09');

-- Dumping structure for table ticketing-system.inquiries_reply_attachment
CREATE TABLE IF NOT EXISTS `inquiries_reply_attachment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inquiries_reply_id` int DEFAULT NULL,
  `file_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `file_size` bigint DEFAULT NULL,
  `file_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `attachment_url` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_inquiries_reply_attachment_inquiries_reply` (`inquiries_reply_id`),
  CONSTRAINT `FK_inquiries_reply_attachment_inquiries_reply` FOREIGN KEY (`inquiries_reply_id`) REFERENCES `inquiries_reply` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.inquiries_reply_attachment: ~0 rows (approximately)

-- Dumping structure for table ticketing-system.issues
CREATE TABLE IF NOT EXISTS `issues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `categories_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `possible_solutions` longtext,
  `is_publish` tinyint DEFAULT '0',
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_issues_categories` (`categories_id`),
  KEY `fk_issues_product` (`product_id`),
  CONSTRAINT `FK_issues_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_issues_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.issues: ~43 rows (approximately)
INSERT INTO `issues` (`id`, `pid`, `name`, `categories_id`, `product_id`, `possible_solutions`, `is_publish`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(8, '13e64540-5718-4833-a7c4-66d1da611db2', 'Broken Screen', 7, 12, NULL, 0, 0, '2025-12-10 05:43:11', '2026-02-06 07:25:31'),
	(21, '23336385-99d2-466d-8c5c-dec5a54dc668', 'Port Malfunction', 7, 12, NULL, 0, 0, '2025-12-10 05:56:57', NULL),
	(26, '5d136ee8-2fe8-425d-963f-367fd60ab9bf', '‎ Others', 23, 12, '‎&nbsp; Test', 0, 0, '2026-01-09 03:58:47', '2026-03-19 03:12:28'),
	(32, '7b999010-d0db-441f-84e4-5a21b3f72ff0', 'Split Screen / Dual Screen', 7, 12, NULL, 0, 0, '2026-02-06 07:27:26', NULL),
	(33, '83c9968c-a6b2-49d3-8cec-3f59ce1dd2b4', 'Black Screen', 7, 12, 'None', 0, 0, '2026-02-06 07:28:53', '2026-03-19 03:11:37'),
	(34, '88bd76fd-a4f1-4f79-a20c-3483cc851599', 'No Display', 7, 12, NULL, 0, 0, '2026-02-06 07:29:19', NULL),
	(35, '8611c8de-f2d0-40d4-ba98-56def8cf7b34', '‎ Others', 23, 33, '‎&nbsp; Test', 0, 0, '2026-02-06 07:38:09', '2026-03-19 03:12:28'),
	(36, 'b5fef5ef-d369-4502-9b1c-19a2322d437b', '‎ Others', 23, 32, '‎&nbsp; Test', 0, 0, '2026-02-06 07:39:30', '2026-03-19 03:12:28'),
	(37, '737eb3fd-211b-4310-87a1-e15a95fb8e4d', '‎ Others', 23, 35, '‎&nbsp; Test', 0, 0, '2026-02-06 07:40:16', '2026-03-19 03:12:28'),
	(38, 'fab269b4-c594-4b4a-b476-f84b78002eb8', 'Not Charging', 22, 35, NULL, 0, 0, '2026-02-06 07:44:25', NULL),
	(39, '153c6742-4c36-4e77-870b-a2c8ef2ff6de', 'Dead Battery', 22, 35, NULL, 0, 0, '2026-02-06 07:45:25', NULL),
	(40, 'b5a0a7c3-e0a7-4cb4-bc8f-791b8f512fc3', 'No Touch / Ghost Touch', 7, 12, NULL, 0, 0, '2026-02-06 07:45:51', '2026-02-06 07:47:15'),
	(41, '7d4b1123-b1ed-43a0-9ac2-e3a232bf548e', 'Windows Not Working', 7, 30, NULL, 0, 0, '2026-02-06 07:46:24', NULL),
	(42, '4c61377e-ca82-4a27-81a6-8cfa23feb9c8', 'Android Not Working', 7, 12, 'None tv', 0, 0, '2026-02-06 07:46:37', '2026-03-19 03:11:28'),
	(43, '41538715-ebe0-4946-be70-d54da48e4956', 'Distorted Display', 7, 12, NULL, 0, 0, '2026-02-06 07:47:03', NULL),
	(44, '95bad31c-b1a4-4387-a5f1-82bf0b9ce114', 'Battery', 6, 32, NULL, 0, 0, '2026-02-06 07:48:32', NULL),
	(45, '978dca0f-b43d-4296-acf7-80189e06d9e1', 'Android Not Working', 7, 32, 'None tv', 0, 0, '2026-02-06 07:48:58', '2026-03-19 03:11:28'),
	(46, '8866b1e3-70e0-48ca-af1b-fdc87671cfde', 'Not Charging', 6, 32, NULL, 0, 0, '2026-02-06 07:49:09', NULL),
	(47, 'daca3949-45c6-48f8-a1ab-3e8237f5140b', 'Black Screen', 7, 32, 'None', 0, 0, '2026-02-06 07:49:38', '2026-03-19 03:11:37'),
	(48, '6481ec85-3291-4d45-af3b-6327b08d1cc4', 'No Display', 6, 32, NULL, 0, 0, '2026-02-06 07:49:46', NULL),
	(49, 'dcd95db5-34f5-4870-b729-c8cd446a6668', 'No Touch / Ghost Touch', 6, 32, NULL, 0, 0, '2026-02-06 07:49:56', NULL),
	(50, '7ca96d4a-34bd-419c-9ffd-191e6b7b9089', 'Beep Noise', 22, 35, NULL, 0, 0, '2026-02-06 07:56:52', NULL),
	(51, 'fef7543d-d909-4920-abba-e28b24d9a3d1', 'Pin Locked', 7, 12, NULL, 0, 0, '2026-02-06 08:00:27', NULL),
	(52, '894b6296-0661-4b6c-a97c-3ba38161fa1f', 'Dead Pixel', 7, 12, NULL, 0, 0, '2026-02-06 08:00:40', NULL),
	(53, '73650f22-c30d-49c5-9b59-d7368f1ecad7', 'No Internet Connection', 23, 36, NULL, 0, 0, '2026-02-12 07:05:33', NULL),
	(54, '5ad96118-77df-440b-a67b-9acdcb11fd06', '‎ Others', 23, 36, '‎&nbsp; Test', 0, 1, '2026-02-12 07:05:41', '2026-03-19 02:57:36'),
	(55, '5680397a-ded8-44ef-ab5a-d0a83e435c4d', 'Blue Screen', 7, 12, NULL, 0, 0, '2026-02-13 07:02:05', NULL),
	(56, '9ca61fc4-753f-400d-939e-2261bcce014a', 'Blue Screen', 7, 30, 'None', 0, 0, '2026-02-25 06:31:13', NULL),
	(57, '9d01681c-742c-4d76-888c-777f3d097ae4', 'Dead Pixel', 7, 30, 'None', 0, 0, '2026-02-25 06:31:36', NULL),
	(58, 'a1d338ca-60c7-4f10-9027-a72859b4d04d', 'Pin Locked', 7, 30, 'None', 0, 0, '2026-02-25 06:31:59', NULL),
	(59, 'db5ac528-bc57-43a2-8d99-ff59cc5f0bf0', 'Distorted Display', 7, 30, 'None', 0, 0, '2026-02-25 06:32:24', NULL),
	(60, '274fded0-b7cc-4314-8c67-43440f184748', 'Android Not Working', 7, 30, 'None tv', 0, 0, '2026-02-25 06:32:41', '2026-03-19 03:11:28'),
	(61, 'd7574ed4-4211-4d26-9836-05a7584e9581', 'Windows Not Working', 7, 30, 'None', 0, 0, '2026-02-25 06:33:02', NULL),
	(62, 'a8641ef1-9836-4b34-97e4-a43bbd76545e', 'No Touch / Ghost Touch', 7, 30, 'None', 0, 0, '2026-02-25 06:33:34', NULL),
	(63, 'c916de1a-6f6d-45e0-8063-1f51e8d79abf', 'No Display', 7, 30, 'None', 0, 0, '2026-02-25 06:33:50', NULL),
	(64, '8e6ce99d-e1b3-47cf-b13e-2182f7d8fb58', 'Black Screen', 7, 30, 'None', 0, 0, '2026-02-25 06:40:33', '2026-03-19 03:11:37'),
	(65, '27e463e0-a3e2-47c9-89f1-a6b3ac04bbcd', 'Split Screen / Dual Screen', 7, 30, 'None', 0, 0, '2026-02-25 06:41:15', NULL),
	(66, '99704938-414f-4586-8936-90e0ef41e49f', 'Port Malfunction', 7, 30, 'None', 0, 0, '2026-02-25 06:41:37', NULL),
	(67, '1b80ee46-5de2-4f79-b2bc-ea326ed5d23f', 'Broken Screen', 7, 30, 'None', 0, 0, '2026-02-25 06:41:52', NULL),
	(68, '9ae33965-f55e-44b8-9481-d8380cf94fb3', 'Blue Screen', 7, 26, 'None', 0, 0, '2026-02-25 07:03:23', NULL),
	(69, '94d70441-cf6b-466f-b4c2-b8a1e41aaf18', 'Dead Pixel', 7, 26, 'None', 0, 0, '2026-02-25 07:03:45', NULL),
	(70, '9a36cc2a-aee7-4baa-b900-b07afef5a338', 'Pin Locked', 7, 26, 'None', 0, 0, '2026-02-25 07:03:57', NULL),
	(71, 'd890a7b9-89e5-4edd-9e89-c23e3f8b9fda', 'Windows Not Working', 7, 12, 'none', 0, 0, '2026-02-26 02:05:55', NULL);

-- Dumping structure for table ticketing-system.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) NOT NULL DEFAULT '0',
  `type` enum('inquiries','job-order') DEFAULT NULL,
  `is_read` tinyint NOT NULL DEFAULT (0),
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.notifications: ~24 rows (approximately)
INSERT INTO `notifications` (`id`, `pid`, `type`, `is_read`, `created_at`) VALUES
	(1, '02ffe8d6-2dbb-45e1-bc61-c7a9da563f62', 'inquiries', 0, '2025-12-23 07:53:23'),
	(2, '281e450f-d432-4b3b-a01d-c42cbaec92b0', 'inquiries', 0, '2025-12-23 08:07:16'),
	(3, 'ad93810c-4be6-44b4-a306-62f71566be83', 'inquiries', 0, '2025-12-23 08:14:02'),
	(4, '710d7ce1-1030-4114-847b-3916dfa38677', 'inquiries', 0, '2025-12-23 08:24:36'),
	(5, '70d568ae-aced-4bcb-b364-342e04dec3cd', 'inquiries', 0, '2026-01-05 02:17:14'),
	(6, '22e4d887-57c9-483a-af7b-b0399a4d9952', 'inquiries', 0, '2026-01-06 11:01:05'),
	(7, '8bf2a11c-a16a-47b7-95ed-abbdbca3b4f7', 'inquiries', 0, '2026-01-06 12:18:10'),
	(8, 'a01af832-9e47-4b61-905f-30d1a8ee25c4', 'inquiries', 0, '2026-01-07 11:41:23'),
	(9, 'fbf89b79-a62c-49e7-91d6-85047632b1a0', 'inquiries', 0, '2026-01-08 01:59:40'),
	(10, '3bdde032-2a04-4bbb-a7b7-73481eab6760', 'inquiries', 0, '2026-01-08 03:00:17'),
	(11, '7da7e0f8-6d10-488a-805d-eeb8199c24e0', 'inquiries', 0, '2026-01-08 08:51:08'),
	(12, '3c29c94e-8230-4362-ba19-f2b789defe16', 'inquiries', 0, '2026-01-12 01:53:01'),
	(13, '6670a985-fda8-4a81-bc9c-b0fb798f1704', 'inquiries', 0, '2026-01-13 04:44:08'),
	(14, '65339825-6d26-42f2-9f77-e1ae8686113b', 'inquiries', 0, '2026-01-13 04:45:14'),
	(15, 'd561bc3c-4bbe-4201-98e9-c81c7d15b7f5', 'inquiries', 0, '2026-01-13 04:52:52'),
	(16, '39b25c50-50a3-4d18-8bc2-0902cffe7df7', 'inquiries', 0, '2026-01-13 04:53:03'),
	(17, 'f167de80-32a1-4129-9230-13446c7d2715', 'inquiries', 0, '2026-01-13 04:58:34'),
	(18, '83e5e921-4de1-40a0-8918-fd4d2773bb3c', 'inquiries', 0, '2026-01-14 10:13:47'),
	(19, 'f6214a40-e69a-42fe-b3ee-333209ecad55', 'inquiries', 0, '2026-01-14 12:55:08'),
	(20, '885b4cea-e790-416d-a47e-f3714514a344', 'inquiries', 0, '2026-01-29 06:11:18'),
	(21, 'cd6eb9d2-4060-4f6f-b4f0-95168ab26860', 'inquiries', 0, '2026-01-30 06:34:09'),
	(22, '4ae7b898-9491-41b7-b27e-3f0fba20e476', 'inquiries', 0, '2026-02-06 03:37:31'),
	(23, '868c3068-65ce-4c18-a54d-51dce388bb94', 'inquiries', 0, '2026-03-06 05:29:59'),
	(24, '1cb1efc3-541e-4004-b676-d037f226182f', 'inquiries', 0, '2026-03-09 07:07:09');

-- Dumping structure for table ticketing-system.organizations
CREATE TABLE IF NOT EXISTS `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.organizations: ~3 rows (approximately)
INSERT INTO `organizations` (`id`, `pid`, `name`, `created_at`, `updated_at`) VALUES
	(3, '16d8ac8c-06e2-4f4f-a4f5-092af2c40b08', 'Company', '2025-12-04 02:34:55', NULL),
	(4, '126cdb2e-7a05-4f39-bb0f-9dd7f6ebe3ab', 'Other', '2025-12-04 02:35:02', NULL),
	(5, 'a3f6c504-07e8-428c-a3c9-a77db29fe997', 'School', '2025-12-04 02:35:08', '2025-12-04 02:35:15');

-- Dumping structure for table ticketing-system.positions
CREATE TABLE IF NOT EXISTS `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `is_protected` tinyint DEFAULT NULL,
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.positions: ~6 rows (approximately)
INSERT INTO `positions` (`id`, `pid`, `name`, `description`, `is_protected`, `permission`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(25, '767dfa92-6708-431e-9656-e16bac0ab4aa', 'Super admin', 'Full system access - cannot be modified', 1, NULL, 0, '2026-01-19 01:37:06', '2026-03-18 02:10:55'),
	(26, '6d51110e-e3ba-465a-8053-568a52af7a54', 'Technician', 'Technician', 0, NULL, 0, '2026-01-19 01:54:16', '2026-03-02 01:14:08'),
	(36, 'b1838a5e-eb52-4a33-96e0-c05e5ca1888d', 'Developer', 'Developer', 0, NULL, 0, '2026-01-29 05:57:27', '2026-03-16 01:31:41'),
	(37, '2999c96d-fc4e-45ca-9054-b5f005b4e6c6', 'SysAdmin', 'System Administrator', 0, NULL, 0, '2026-02-06 06:56:30', '2026-03-18 11:26:40'),
	(38, '5b3a23d2-65e9-4da0-ba70-993e026703df', 'Admin', 'Administrative', 0, NULL, 0, '2026-02-19 01:25:17', '2026-03-13 01:36:45'),
	(39, '22b30906-3535-464f-bbdd-a22ab7c9c06f', 'Tester', 'for testing', 0, NULL, 0, '2026-03-18 02:07:04', NULL);

-- Dumping structure for table ticketing-system.positions_permissions
CREATE TABLE IF NOT EXISTS `positions_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position_id` int DEFAULT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `children_id` varchar(50) DEFAULT NULL,
  `module_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `module_url` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__positions` (`position_id`),
  CONSTRAINT `FK__positions` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=310 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.positions_permissions: ~51 rows (approximately)
INSERT INTO `positions_permissions` (`id`, `position_id`, `parent_id`, `children_id`, `module_name`, `module_url`, `created_at`) VALUES
	(236, 26, 'dashboard', '', 'Dashboard', '/beesee/dashboard', '2026-03-02 01:14:08'),
	(237, 26, 'job-order', '', 'Job Order', '/beesee/job-order', '2026-03-02 01:14:08'),
	(238, 26, 'faqs', '', 'Faqs', '/beesee/faqs', '2026-03-02 01:14:08'),
	(239, 26, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-02 01:14:08'),
	(240, 26, 'settings', 'device', 'Device type', '/beesee/device', '2026-03-02 01:14:08'),
	(241, 26, 'settings', 'model', 'Model type', '/beesee/model', '2026-03-02 01:14:08'),
	(242, 26, 'settings', 'issue', 'Issue type', '/beesee/issue', '2026-03-02 01:14:08'),
	(289, 38, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-13 01:36:45'),
	(290, 38, 'careers', '', 'Careers', '/beesee/job-posting', '2026-03-13 01:36:45'),
	(291, 38, 'users', 'list_user', 'Users', '/beesee/users', '2026-03-13 01:36:45'),
	(292, 36, 'dashboard', '', 'Dashboard', '/beesee/dashboard', '2026-03-16 01:31:41'),
	(293, 36, 'job-order', '', 'Job Order', '/beesee/job-order', '2026-03-16 01:31:41'),
	(294, 36, 'faqs', '', 'Faqs', '/beesee/faqs', '2026-03-16 01:31:41'),
	(295, 36, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-16 01:31:41'),
	(296, 36, 'careers', '', 'Careers', '/beesee/job-posting', '2026-03-16 01:31:41'),
	(297, 36, 'settings', 'device', 'Device type', '/beesee/device', '2026-03-16 01:31:41'),
	(298, 36, 'settings', 'model', 'Model type', '/beesee/model', '2026-03-16 01:31:41'),
	(299, 36, 'settings', 'issue', 'Issue type', '/beesee/issue', '2026-03-16 01:31:41'),
	(310, 39, 'dashboard', '', 'Dashboard', '/beesee/dashboard', '2026-03-18 02:07:04'),
	(311, 39, 'job-order', '', 'Job Order', '/beesee/job-order', '2026-03-18 02:07:04'),
	(312, 39, 'faqs', '', 'Faqs', '/beesee/faqs', '2026-03-18 02:07:04'),
	(313, 39, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-18 02:07:04'),
	(314, 39, 'careers', '', 'Careers', '/beesee/job-posting', '2026-03-18 02:07:04'),
	(315, 39, 'audit-logs', '', 'Audit Logs', '/beesee/audit-logs', '2026-03-18 02:07:04'),
	(316, 39, 'users', 'list_user', 'Users', '/beesee/users', '2026-03-18 02:07:04'),
	(317, 39, 'users', 'position', 'Position', '/beesee/position', '2026-03-18 02:07:04'),
	(318, 39, 'settings', 'device', 'Device type', '/beesee/device', '2026-03-18 02:07:04'),
	(319, 39, 'settings', 'model', 'Model type', '/beesee/model', '2026-03-18 02:07:04'),
	(320, 39, 'settings', 'issue', 'Issue type', '/beesee/issue', '2026-03-18 02:07:04'),
	(351, 25, 'dashboard', '', 'Dashboard', '/beesee/dashboard', '2026-03-18 02:10:55'),
	(352, 25, 'job-order', '', 'Job Order', '/beesee/job-order', '2026-03-18 02:10:55'),
	(353, 25, 'faqs', '', 'Faqs', '/beesee/faqs', '2026-03-18 02:10:55'),
	(354, 25, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-18 02:10:55'),
	(355, 25, 'careers', '', 'Careers', '/beesee/job-posting', '2026-03-18 02:10:55'),
	(356, 25, 'audit-logs', '', 'Audit Logs', '/beesee/audit-logs', '2026-03-18 02:10:55'),
	(357, 25, 'users', 'list_user', 'Users', '/beesee/users', '2026-03-18 02:10:55'),
	(358, 25, 'users', 'position', 'Position', '/beesee/position', '2026-03-18 02:10:55'),
	(359, 25, 'settings', 'device', 'Device type', '/beesee/device', '2026-03-18 02:10:55'),
	(360, 25, 'settings', 'model', 'Model type', '/beesee/model', '2026-03-18 02:10:55'),
	(361, 25, 'settings', 'issue', 'Issue type', '/beesee/issue', '2026-03-18 02:10:55'),
	(362, 37, 'dashboard', '', 'Dashboard', '/beesee/dashboard', '2026-03-18 11:26:40'),
	(363, 37, 'job-order', '', 'Job Order', '/beesee/job-order', '2026-03-18 11:26:40'),
	(364, 37, 'faqs', '', 'Faqs', '/beesee/faqs', '2026-03-18 11:26:40'),
	(365, 37, 'inquiries', '', 'Inquiries', '/beesee/inquiries', '2026-03-18 11:26:40'),
	(366, 37, 'careers', '', 'Careers', '/beesee/job-posting', '2026-03-18 11:26:40'),
	(367, 37, 'audit-logs', '', 'Audit Logs', '/beesee/audit-logs', '2026-03-18 11:26:40'),
	(368, 37, 'users', 'list_user', 'Users', '/beesee/users', '2026-03-18 11:26:40'),
	(369, 37, 'users', 'position', 'Position', '/beesee/position', '2026-03-18 11:26:40'),
	(370, 37, 'settings', 'device', 'Device type', '/beesee/device', '2026-03-18 11:26:40'),
	(371, 37, 'settings', 'model', 'Model type', '/beesee/model', '2026-03-18 11:26:40'),
	(372, 37, 'settings', 'issue', 'Issue type', '/beesee/issue', '2026-03-18 11:26:40');

-- Dumping structure for table ticketing-system.positions_permission_actions
CREATE TABLE IF NOT EXISTS `positions_permission_actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position_permission_id` int DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_positions_permission_actions_positions_permissions` (`position_permission_id`),
  CONSTRAINT `FK_positions_permission_actions_positions_permissions` FOREIGN KEY (`position_permission_id`) REFERENCES `positions_permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=938 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.positions_permission_actions: ~150 rows (approximately)
INSERT INTO `positions_permission_actions` (`id`, `position_permission_id`, `action`, `created_at`) VALUES
	(708, 236, '', '2026-03-02 01:14:08'),
	(709, 237, 'view', '2026-03-02 01:14:08'),
	(710, 237, 'add', '2026-03-02 01:14:08'),
	(711, 238, 'view', '2026-03-02 01:14:08'),
	(712, 238, 'add', '2026-03-02 01:14:08'),
	(713, 238, 'edit', '2026-03-02 01:14:08'),
	(714, 238, 'delete', '2026-03-02 01:14:08'),
	(715, 239, 'view', '2026-03-02 01:14:08'),
	(716, 240, 'view', '2026-03-02 01:14:08'),
	(717, 240, 'add', '2026-03-02 01:14:08'),
	(718, 240, 'edit', '2026-03-02 01:14:08'),
	(719, 240, 'delete', '2026-03-02 01:14:08'),
	(720, 241, 'view', '2026-03-02 01:14:08'),
	(721, 241, 'delete', '2026-03-02 01:14:08'),
	(722, 241, 'edit', '2026-03-02 01:14:08'),
	(723, 241, 'add', '2026-03-02 01:14:08'),
	(724, 242, 'view', '2026-03-02 01:14:08'),
	(725, 242, 'add', '2026-03-02 01:14:08'),
	(726, 242, 'edit', '2026-03-02 01:14:08'),
	(727, 242, 'delete', '2026-03-02 01:14:08'),
	(885, 289, 'view', '2026-03-13 01:36:45'),
	(886, 289, 'delete', '2026-03-13 01:36:45'),
	(887, 290, 'view', '2026-03-13 01:36:45'),
	(888, 290, 'add', '2026-03-13 01:36:45'),
	(889, 290, 'edit', '2026-03-13 01:36:45'),
	(890, 290, 'delete', '2026-03-13 01:36:45'),
	(891, 291, 'view', '2026-03-13 01:36:45'),
	(892, 291, 'add', '2026-03-13 01:36:45'),
	(893, 292, '', '2026-03-16 01:31:41'),
	(894, 293, 'view', '2026-03-16 01:31:41'),
	(895, 293, 'add', '2026-03-16 01:31:41'),
	(896, 294, 'view', '2026-03-16 01:31:41'),
	(897, 294, 'add', '2026-03-16 01:31:41'),
	(898, 294, 'edit', '2026-03-16 01:31:41'),
	(899, 295, 'view', '2026-03-16 01:31:41'),
	(900, 296, 'view', '2026-03-16 01:31:41'),
	(901, 297, 'view', '2026-03-16 01:31:41'),
	(902, 298, 'view', '2026-03-16 01:31:41'),
	(903, 299, 'view', '2026-03-16 01:31:41'),
	(938, 310, '', '2026-03-18 02:07:04'),
	(939, 311, 'view', '2026-03-18 02:07:04'),
	(940, 311, 'add', '2026-03-18 02:07:04'),
	(941, 311, 'delete', '2026-03-18 02:07:04'),
	(942, 311, 'close_job_order', '2026-03-18 02:07:04'),
	(943, 312, 'view', '2026-03-18 02:07:04'),
	(944, 312, 'add', '2026-03-18 02:07:04'),
	(945, 312, 'edit', '2026-03-18 02:07:04'),
	(946, 312, 'delete', '2026-03-18 02:07:04'),
	(947, 313, 'view', '2026-03-18 02:07:04'),
	(948, 313, 'delete', '2026-03-18 02:07:04'),
	(949, 313, 'closed_inquiries', '2026-03-18 02:07:04'),
	(950, 314, 'view', '2026-03-18 02:07:04'),
	(951, 314, 'add', '2026-03-18 02:07:04'),
	(952, 314, 'edit', '2026-03-18 02:07:04'),
	(953, 314, 'delete', '2026-03-18 02:07:04'),
	(954, 315, 'view', '2026-03-18 02:07:04'),
	(955, 316, 'view', '2026-03-18 02:07:04'),
	(956, 316, 'add', '2026-03-18 02:07:04'),
	(957, 316, 'edit', '2026-03-18 02:07:04'),
	(958, 316, 'delete', '2026-03-18 02:07:04'),
	(959, 317, 'view', '2026-03-18 02:07:04'),
	(960, 317, 'add', '2026-03-18 02:07:04'),
	(961, 317, 'edit', '2026-03-18 02:07:04'),
	(962, 317, 'delete', '2026-03-18 02:07:04'),
	(963, 318, 'view', '2026-03-18 02:07:04'),
	(964, 318, 'add', '2026-03-18 02:07:04'),
	(965, 318, 'edit', '2026-03-18 02:07:04'),
	(966, 318, 'delete', '2026-03-18 02:07:04'),
	(967, 319, 'view', '2026-03-18 02:07:04'),
	(968, 319, 'add', '2026-03-18 02:07:04'),
	(969, 319, 'delete', '2026-03-18 02:07:04'),
	(970, 319, 'edit', '2026-03-18 02:07:04'),
	(971, 320, 'view', '2026-03-18 02:07:04'),
	(972, 320, 'add', '2026-03-18 02:07:04'),
	(973, 320, 'edit', '2026-03-18 02:07:04'),
	(974, 320, 'delete', '2026-03-18 02:07:04'),
	(1083, 351, '', '2026-03-18 02:10:55'),
	(1084, 352, 'view', '2026-03-18 02:10:55'),
	(1085, 352, 'add', '2026-03-18 02:10:55'),
	(1086, 352, 'delete', '2026-03-18 02:10:55'),
	(1087, 352, 'close_job_order', '2026-03-18 02:10:55'),
	(1088, 353, 'view', '2026-03-18 02:10:55'),
	(1089, 353, 'delete', '2026-03-18 02:10:55'),
	(1090, 353, 'edit', '2026-03-18 02:10:55'),
	(1091, 353, 'add', '2026-03-18 02:10:55'),
	(1092, 354, 'view', '2026-03-18 02:10:55'),
	(1093, 354, 'delete', '2026-03-18 02:10:55'),
	(1094, 354, 'closed_inquiries', '2026-03-18 02:10:55'),
	(1095, 355, 'view', '2026-03-18 02:10:55'),
	(1096, 355, 'edit', '2026-03-18 02:10:55'),
	(1097, 355, 'delete', '2026-03-18 02:10:55'),
	(1098, 355, 'add', '2026-03-18 02:10:55'),
	(1099, 356, 'view', '2026-03-18 02:10:55'),
	(1100, 357, 'view', '2026-03-18 02:10:55'),
	(1101, 357, 'add', '2026-03-18 02:10:55'),
	(1102, 357, 'delete', '2026-03-18 02:10:55'),
	(1103, 357, 'edit', '2026-03-18 02:10:55'),
	(1104, 358, 'view', '2026-03-18 02:10:55'),
	(1105, 358, 'add', '2026-03-18 02:10:55'),
	(1106, 358, 'edit', '2026-03-18 02:10:55'),
	(1107, 358, 'delete', '2026-03-18 02:10:55'),
	(1108, 359, 'view', '2026-03-18 02:10:55'),
	(1109, 359, 'add', '2026-03-18 02:10:55'),
	(1110, 359, 'edit', '2026-03-18 02:10:55'),
	(1111, 359, 'delete', '2026-03-18 02:10:55'),
	(1112, 360, 'view', '2026-03-18 02:10:55'),
	(1113, 360, 'add', '2026-03-18 02:10:55'),
	(1114, 360, 'edit', '2026-03-18 02:10:55'),
	(1115, 360, 'delete', '2026-03-18 02:10:55'),
	(1116, 361, 'view', '2026-03-18 02:10:55'),
	(1117, 361, 'add', '2026-03-18 02:10:55'),
	(1118, 361, 'edit', '2026-03-18 02:10:55'),
	(1119, 361, 'delete', '2026-03-18 02:10:55'),
	(1120, 362, '', '2026-03-18 11:26:40'),
	(1121, 363, 'view', '2026-03-18 11:26:40'),
	(1122, 363, 'add', '2026-03-18 11:26:40'),
	(1123, 363, 'delete', '2026-03-18 11:26:40'),
	(1124, 363, 'close_job_order', '2026-03-18 11:26:40'),
	(1125, 364, 'view', '2026-03-18 11:26:40'),
	(1126, 364, 'add', '2026-03-18 11:26:40'),
	(1127, 364, 'edit', '2026-03-18 11:26:40'),
	(1128, 364, 'delete', '2026-03-18 11:26:40'),
	(1129, 365, 'view', '2026-03-18 11:26:40'),
	(1130, 365, 'delete', '2026-03-18 11:26:40'),
	(1131, 365, 'closed_inquiries', '2026-03-18 11:26:40'),
	(1132, 366, 'view', '2026-03-18 11:26:40'),
	(1133, 366, 'add', '2026-03-18 11:26:40'),
	(1134, 366, 'edit', '2026-03-18 11:26:40'),
	(1135, 366, 'delete', '2026-03-18 11:26:40'),
	(1136, 367, 'view', '2026-03-18 11:26:40'),
	(1137, 368, 'view', '2026-03-18 11:26:40'),
	(1138, 368, 'add', '2026-03-18 11:26:40'),
	(1139, 368, 'edit', '2026-03-18 11:26:40'),
	(1140, 368, 'delete', '2026-03-18 11:26:40'),
	(1141, 369, 'view', '2026-03-18 11:26:40'),
	(1142, 369, 'add', '2026-03-18 11:26:40'),
	(1143, 369, 'edit', '2026-03-18 11:26:40'),
	(1144, 369, 'delete', '2026-03-18 11:26:40'),
	(1145, 370, 'view', '2026-03-18 11:26:40'),
	(1146, 370, 'add', '2026-03-18 11:26:40'),
	(1147, 370, 'edit', '2026-03-18 11:26:40'),
	(1148, 370, 'delete', '2026-03-18 11:26:40'),
	(1149, 371, 'view', '2026-03-18 11:26:40'),
	(1150, 371, 'add', '2026-03-18 11:26:40'),
	(1151, 371, 'edit', '2026-03-18 11:26:40'),
	(1152, 371, 'delete', '2026-03-18 11:26:40'),
	(1153, 372, 'view', '2026-03-18 11:26:40'),
	(1154, 372, 'add', '2026-03-18 11:26:40'),
	(1155, 372, 'edit', '2026-03-18 11:26:40'),
	(1156, 372, 'delete', '2026-03-18 11:26:40');

-- Dumping structure for table ticketing-system.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `categories_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__categories` (`categories_id`) USING BTREE,
  CONSTRAINT `FK__categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.products: ~7 rows (approximately)
INSERT INTO `products` (`id`, `pid`, `name`, `categories_id`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(12, '45f719bb-db2a-4dbc-b2d6-0004018c1fba', '75" Educational TV', 7, 0, '2025-11-20 02:43:54', '2026-02-06 07:05:44'),
	(26, '72786a20-caf8-479c-a433-2970d27afe3a', '86" Educational TV', 7, 0, '2026-01-30 03:05:31', '2026-02-06 07:05:59'),
	(30, '2d438618-4760-4b0e-84cf-194fe1f92d4b', '105" Educational TV', 7, 0, '2026-02-06 07:13:58', NULL),
	(32, 'a9e5918d-b4af-4fc7-b1c7-2d8d6fc2e44b', 'Beepad 10.1', 6, 0, '2026-02-06 07:24:50', NULL),
	(33, '0a823e30-89c2-4d84-a76b-f4b37170905a', 'Others', 21, 0, '2026-02-06 07:33:45', NULL),
	(35, '72461351-8520-4e1e-8390-50c8a4f6b3c7', 'Intex', 22, 0, '2026-02-06 07:42:05', NULL),
	(36, '563ae4a3-3206-4f2d-a96a-48cdfc6b60cc', 'Network', 23, 0, '2026-02-12 07:05:08', NULL);

-- Dumping structure for table ticketing-system.tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reference_number` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `categories_id` int DEFAULT NULL,
  `products_id` int DEFAULT NULL,
  `issues_id` int DEFAULT NULL,
  `serial_number` char(50) DEFAULT NULL,
  `status` enum('open','resolved','ongoing') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `customers_id` int DEFAULT NULL,
  `item_name` longtext,
  `is_deleted` tinyint DEFAULT '0',
  `is_read` tinyint DEFAULT '1',
  `is_closed` tinyint DEFAULT '0',
  `remarks` longtext,
  `date_closed` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_number` (`reference_number`),
  KEY `FK_tickets_customers` (`customers_id`) USING BTREE,
  KEY `FK_tickets_categories` (`categories_id`),
  KEY `FK_tickets_issues` (`issues_id`),
  KEY `FK_tickets_products` (`products_id`) USING BTREE,
  CONSTRAINT `FK_tickets_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_tickets_customers` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_tickets_issues` FOREIGN KEY (`issues_id`) REFERENCES `issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets: ~37 rows (approximately)
INSERT INTO `tickets` (`id`, `reference_number`, `categories_id`, `products_id`, `issues_id`, `serial_number`, `status`, `questions`, `customers_id`, `item_name`, `is_deleted`, `is_read`, `is_closed`, `remarks`, `date_closed`, `created_at`, `updated_at`) VALUES
	(195, 'TK-71420', 21, 33, 35, 'N/A', 'resolved', 'No internet in access point', 200, NULL, 0, 1, 1, NULL, NULL, '2026-02-12 06:05:48', '2026-03-03 08:43:10'),
	(196, 'TK-30206', 22, 35, 38, 'SKPU72622091825', 'resolved', 'NOT CHARGING', 201, NULL, 0, 1, 1, NULL, NULL, '2026-02-12 06:45:34', '2026-03-03 06:00:00'),
	(197, 'TK-99697', 7, 12, 26, '', 'resolved', 'Blue Screen Pop Up', 202, NULL, 0, 1, 1, NULL, NULL, '2026-02-12 09:35:38', '2026-03-03 06:00:00'),
	(198, 'TK-32946', 7, 12, 33, '', 'resolved', 'Black Screen', 203, NULL, 0, 1, 1, NULL, NULL, '2026-02-13 07:26:57', '2026-03-03 06:00:00'),
	(199, 'TK-48500', 7, 30, 41, '', 'resolved', 'Windows not working even after performing basic troubleshoot.', 204, NULL, 0, 1, 1, NULL, NULL, '2026-02-13 07:48:48', '2026-03-03 08:42:55'),
	(200, 'TK-66325', 22, 35, 39, 'IT-M725A', 'resolved', 'Not working ', 205, NULL, 0, 1, 1, NULL, NULL, '2026-02-13 08:07:48', '2026-03-03 06:00:00'),
	(201, 'TK-70117', 22, 35, 39, '', 'resolved', 'Two UPS are not working. ', 206, NULL, 0, 1, 1, NULL, NULL, '2026-02-13 08:08:49', '2026-03-03 06:00:00'),
	(202, 'TK-12437', 7, 12, 21, 'Accessories Parts', 'resolved', '311-B broken plug. ', 207, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 01:51:35', '2026-02-26 02:38:10'),
	(203, 'TK-10810', 7, 12, 26, 'DS0119460269160038', 'resolved', 'Flickering power', 208, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:18:20', '2026-03-06 06:00:00'),
	(204, 'TK-85459', 7, 12, 33, 'DS0091160308020005', 'resolved', 'BLACK SCREEN FADING, UPS NOT CHARGING', 209, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:19:32', '2026-03-06 06:00:00'),
	(205, 'TK-12933', 7, 12, 33, 'DS0119460269160035', 'resolved', 'TV NO POWER', 210, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:23:31', '2026-03-06 06:00:00'),
	(206, 'TK-22790', 22, 35, 39, 'SKPU7262209100564', 'resolved', 'NO POWER', 211, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:24:25', '2026-03-06 06:00:00'),
	(207, 'TK-61361', 7, 12, 26, 'DS0091160308020170', 'resolved', 'BYTELLO NOT CONNECTED', 212, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:26:00', '2026-03-06 06:00:00'),
	(208, 'TK-90670', 22, 35, 38, 'TVPH7252211100286', 'resolved', 'NO POWER', 213, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:26:49', '2026-03-06 06:00:00'),
	(209, 'TK-19663', 23, 36, 53, '', 'resolved', 'NO POWER IN POWER STRIP AND POWER SOURCE', 214, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:28:02', '2026-03-06 06:00:00'),
	(210, 'TK-92466', 7, 12, 26, '', 'resolved', 'NO INTERNET CONNECTION', 215, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:30:18', '2026-03-06 06:00:00'),
	(211, 'TK-27776', 22, 35, 39, 'TVPH7252211100019', 'resolved', 'NO POWER', 216, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:35:22', '2026-03-06 06:00:00'),
	(212, 'TK-34325', 7, 12, 26, '', 'resolved', 'Cannot connect to the wifi', 217, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 07:47:03', '2026-03-06 06:00:00'),
	(213, 'TK-36461', 7, 12, 33, 'DS0120450269160124', 'resolved', 'Goodmorning po Ma\'am, report ko lang po ayaw po gumana po ng tv namin sa Santiago. Baka po ung CPU po niya ang ayaw. nagamit ko po siya ng first period pero nung second period kay Maam Tina na ayaw na po gumana. Salamat po', 218, NULL, 0, 1, 1, NULL, NULL, '2026-02-18 08:33:46', '2026-03-06 06:00:00'),
	(214, 'TK-53882', 7, 30, 8, 'DS0091160308020062', 'resolved', 'Broken tempered glass', 219, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 02:24:21', '2026-03-06 06:00:00'),
	(215, 'TK-19693', 7, 30, 41, '', 'resolved', 'Ayaw po gumana ng windows po', 220, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 07:07:25', '2026-03-03 02:21:23'),
	(216, 'TK-59982', 7, 12, 26, 'DS0091160308020201', 'resolved', 'PC function is not working', 221, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 07:07:55', '2026-03-03 03:18:11'),
	(217, 'TK-11082', 7, 12, 26, '', 'resolved', 'NO POWER ON', 222, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 07:36:09', '2026-03-07 06:00:00'),
	(218, 'TK-41718', 7, 12, 21, '', 'resolved', 'PALAGING NAGDIDISCONNECT', 223, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 07:38:23', '2026-03-07 06:00:00'),
	(219, 'TK-68429', 7, 12, 26, '', 'resolved', 'NO POWER ON', 224, NULL, 0, 1, 1, NULL, NULL, '2026-02-19 07:39:14', '2026-03-07 06:00:00'),
	(220, 'TK-36641', 7, 12, 33, 'DS0120450269160150', 'resolved', 'The screen is still black even the device power is turned on', 225, NULL, 0, 1, 1, NULL, NULL, '2026-02-20 03:42:51', '2026-03-07 06:00:00'),
	(221, 'TK-80494', 7, 12, 32, 'DS0091160308020157', 'resolved', 'The screen splitted and it mirrors the other half', 226, NULL, 0, 1, 1, NULL, NULL, '2026-02-20 03:50:15', '2026-03-07 06:00:00'),
	(222, 'TK-31723', 7, 12, 32, 'DS0091160308020157', 'resolved', 'The screen splitted and it mirrors the other half', 227, NULL, 0, 1, 1, NULL, NULL, '2026-02-20 03:50:27', '2026-03-07 06:00:00'),
	(223, 'TK-32906', 7, 12, 32, 'DS0091160308020058', 'resolved', 'SPLIT SCREEN', 228, NULL, 0, 1, 1, NULL, NULL, '2026-02-20 07:14:20', '2026-03-08 06:00:00'),
	(224, 'TK-16056', 21, 33, 35, '', 'resolved', 'Unifi Access Point Password per Room. Need Password. ', 229, NULL, 0, 1, 1, NULL, NULL, '2026-02-20 10:26:03', '2026-03-03 02:10:46'),
	(225, 'TK-59539', 7, 12, 51, 'Locked TV', 'resolved', 'Locked TV', 230, NULL, 0, 1, 1, NULL, NULL, '2026-02-23 03:19:24', '2026-03-10 02:13:04'),
	(227, 'TK-67462', 7, 12, 55, NULL, 'resolved', 'Not Working/ No Power  Indication', 232, NULL, 0, 1, 0, NULL, NULL, '2026-03-03 08:28:19', '2026-03-16 02:22:25'),
	(228, 'TK-33492', 7, 12, 55, NULL, 'resolved', 'A Recovery Blue Screen Appears When Switching To Pc Mode.', 233, NULL, 0, 1, 0, NULL, NULL, '2026-03-10 01:46:07', '2026-03-16 02:22:28'),
	(229, 'TK-98190', 7, 12, 34, NULL, 'resolved', 'Wala Pong Power Ang Tv ', 234, NULL, 0, 1, 0, NULL, NULL, '2026-03-12 07:03:25', '2026-03-16 02:22:32'),
	(230, 'TK-20245', 23, 36, 54, '', 'open', 'Need To Change The Wifi Password\n', 235, '', 0, 1, 0, NULL, NULL, '2026-03-13 04:18:58', '2026-03-13 05:39:37'),
	(231, 'TK-53608', 22, 35, 50, 'DS0120450269160124', 'open', 'Once It Was Plug-in To The Outlet There Is A Beep Noise Coming From The Ups And Even It Is Unplug To The Outlet.', 236, '', 0, 1, 0, NULL, NULL, '2026-03-16 00:47:08', '2026-03-16 00:47:08'),
	(233, 'TK-78295', 7, 12, 34, '407B', 'ongoing', 'Light Indicator Or Display From Red To White  ', 238, '', 0, 1, 0, NULL, NULL, '2026-03-18 04:19:13', '2026-03-18 09:09:04');

-- Dumping structure for table ticketing-system.tickets_attachment_detailed
CREATE TABLE IF NOT EXISTS `tickets_attachment_detailed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ref_id` char(50) DEFAULT NULL,
  `attachment_url` longtext,
  `file_name` longtext,
  `file_size` longtext,
  `file_type` longtext,
  `status` enum('before','after') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_attachment_detailed_tickets` (`ref_id`),
  CONSTRAINT `FK_tickets_attachment_detailed_tickets` FOREIGN KEY (`ref_id`) REFERENCES `tickets` (`reference_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_attachment_detailed: ~84 rows (approximately)
INSERT INTO `tickets_attachment_detailed` (`id`, `ref_id`, `attachment_url`, `file_name`, `file_size`, `file_type`, `status`, `created_at`) VALUES
	(10, 'TK-12437', 'https://rgfs.bryansurio.workers.dev/tickets/beforea814aea0-512b-4bfa-84ff-de6ce850f620.jpg', '1000054094.jpg', '296758', 'image/jpeg', 'before', '2026-03-09 08:58:01'),
	(11, 'TK-12437', 'https://rgfs.bryansurio.workers.dev/tickets/beforefa3dbbb5-e04d-4796-85fe-4be463210a12.jpg', '1000054095.jpg', '325864', 'image/jpeg', 'before', '2026-03-09 08:58:01'),
	(12, 'TK-12437', 'https://rgfs.bryansurio.workers.dev/tickets/before79fa7510-e74a-485a-b7b6-a4b5ea22f702.jpg', '1000054096.jpg', '247962', 'image/jpeg', 'after', '2026-03-09 08:58:34'),
	(13, 'TK-12437', 'https://rgfs.bryansurio.workers.dev/tickets/before4ae3b067-6ff6-41eb-84c8-04d5f8b1ae58.jpg', '1000054098.jpg', '349469', 'image/jpeg', 'after', '2026-03-09 08:58:34'),
	(15, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before8a15ec3b-87d2-4838-97e7-407330340d35.jpg', '1000054155.jpg', '319380', 'image/jpeg', 'after', '2026-03-09 09:01:17'),
	(16, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before8bcbfccf-a24a-46d1-b856-6cad918d7567.jpg', '1000054154.jpg', '274367', 'image/jpeg', 'after', '2026-03-09 09:01:17'),
	(17, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before395781a5-8f9c-4667-a8f5-4068496adde1.jpg', '1000054152.jpg', '751384', 'image/jpeg', 'after', '2026-03-09 09:01:17'),
	(18, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before042b12f0-d130-447b-bb8b-8f5f1d683e96.jpg', '1000054150.jpg', '358654', 'image/jpeg', 'after', '2026-03-09 09:01:18'),
	(23, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before2306a050-391f-42ce-bb9c-65e31daa259e.jpg', '1000052649.jpg', '218929', 'image/jpeg', 'before', '2026-03-09 09:07:12'),
	(24, 'TK-59982', 'https://rgfs.bryansurio.workers.dev/tickets/before3f6dec8a-12d1-41c0-b35b-2e2646602e0f.jpg', '1000052656.jpg', '351898', 'image/jpeg', 'before', '2026-03-09 09:07:12'),
	(25, 'TK-99697', 'https://rgfs.bryansurio.workers.dev/tickets/before33bcc814-8ccb-4b69-91f6-e2f99a21e47d.jpg', '1000054103.jpg', '466713', 'image/jpeg', 'before', '2026-03-09 09:08:06'),
	(26, 'TK-99697', 'https://rgfs.bryansurio.workers.dev/tickets/before12c0eba3-16ce-4dd2-9b7b-fe81e5208eab.jpg', '1000054107.jpg', '294211', 'image/jpeg', 'before', '2026-03-09 09:08:06'),
	(27, 'TK-99697', 'https://rgfs.bryansurio.workers.dev/tickets/before556df8ef-b7f5-44c1-ba12-fdcb564a16d6.jpg', '1000054208.jpg', '433547', 'image/jpeg', 'after', '2026-03-09 09:08:38'),
	(28, 'TK-99697', 'https://rgfs.bryansurio.workers.dev/tickets/befored54b3c8d-bf5c-415e-a632-b3b8e525d0fe.jpg', '1000054210.jpg', '476647', 'image/jpeg', 'after', '2026-03-09 09:08:39'),
	(29, 'TK-32946', 'https://rgfs.bryansurio.workers.dev/tickets/before087f6dd1-8ddd-4bd3-bb9f-04b52619b08c.jpg', '1000054368.jpg', '449911', 'image/jpeg', 'before', '2026-03-09 09:11:32'),
	(30, 'TK-32946', 'https://rgfs.bryansurio.workers.dev/tickets/before82f20eaa-7849-4a7d-8e88-45ffad92e88e.jpg', '1000054125.jpg', '353199', 'image/jpeg', 'after', '2026-03-09 09:12:17'),
	(31, 'TK-32946', 'https://rgfs.bryansurio.workers.dev/tickets/beforebb85a915-bb5f-47e8-80f8-8af934c21b5b.jpg', '1000054124.jpg', '529861', 'image/jpeg', 'after', '2026-03-09 09:12:17'),
	(32, 'TK-48500', 'https://rgfs.bryansurio.workers.dev/tickets/before22dff7c7-dde3-4ca3-b4e5-8d62d98bad95.jpg', '1000054103.jpg', '466713', 'image/jpeg', 'before', '2026-03-09 09:15:09'),
	(33, 'TK-48500', 'https://rgfs.bryansurio.workers.dev/tickets/beforee5b1fd36-a7ab-4d96-b751-b23f5effa7fa.jpg', '1000054107.jpg', '294211', 'image/jpeg', 'before', '2026-03-09 09:15:10'),
	(34, 'TK-48500', 'https://rgfs.bryansurio.workers.dev/tickets/before9e128c13-13a0-43b9-b07f-f97333274ab4.jpg', '1000054210.jpg', '476647', 'image/jpeg', 'after', '2026-03-09 09:15:44'),
	(35, 'TK-48500', 'https://rgfs.bryansurio.workers.dev/tickets/before227fc6ee-9b60-4d35-b175-dc087c2b941d.jpg', '1000054208.jpg', '433547', 'image/jpeg', 'after', '2026-03-09 09:15:44'),
	(36, 'TK-71420', 'https://rgfs.bryansurio.workers.dev/tickets/before0a8b2947-9ec9-4ec7-bb77-09261cd219a3.jpg', '1000054215.jpg', '333306', 'image/jpeg', 'after', '2026-03-09 09:16:45'),
	(37, 'TK-71420', 'https://rgfs.bryansurio.workers.dev/tickets/before93e0dd04-bb01-4e81-86b2-0b62fa2e65fb.jpg', '1000054218.jpg', '317151', 'image/jpeg', 'after', '2026-03-09 09:16:45'),
	(38, 'TK-71420', 'https://rgfs.bryansurio.workers.dev/tickets/before650fee82-dbba-400c-90a3-fdf47b5f1022.jpg', '1000054217.jpg', '279748', 'image/jpeg', 'after', '2026-03-09 09:16:46'),
	(39, 'TK-10810', 'https://rgfs.bryansurio.workers.dev/tickets/before4f959ed9-f0ef-4e83-9e3a-90259ffb8d57.jpg', '1000053877.jpg', '443972', 'image/jpeg', 'after', '2026-03-09 09:22:01'),
	(40, 'TK-85459', 'https://rgfs.bryansurio.workers.dev/tickets/before49152322-8041-4edc-bbd4-86ae8042ecd9.png', '1000054369.png', '3890463', 'image/png', 'before', '2026-03-09 09:25:01'),
	(41, 'TK-85459', 'https://rgfs.bryansurio.workers.dev/tickets/beforea3ffa4fd-bc48-4929-9bb2-38c57215255d.jpg', '1000054136.jpg', '355272', 'image/jpeg', 'after', '2026-03-09 09:25:57'),
	(42, 'TK-85459', 'https://rgfs.bryansurio.workers.dev/tickets/before2ee8e6c5-8030-4a3a-97a9-13e82ebc5464.jpg', '1000054137.jpg', '336423', 'image/jpeg', 'after', '2026-03-09 09:25:58'),
	(43, 'TK-12933', 'https://rgfs.bryansurio.workers.dev/tickets/beforee41e06b3-8c59-4ae1-9eb6-a3bd7c679534.jpg', '1000053877.jpg', '443972', 'image/jpeg', 'after', '2026-03-09 09:28:01'),
	(44, 'TK-61361', 'https://rgfs.bryansurio.workers.dev/tickets/before3b07cf57-7940-442a-8395-736d7a773c88.jpg', '1000054370.jpg', '428180', 'image/jpeg', 'after', '2026-03-09 09:32:24'),
	(45, 'TK-34325', 'https://rgfs.bryansurio.workers.dev/tickets/before2120f419-5c01-4749-92a3-2d0b8f4f4362.jpg', '1000053911.jpg', '522974', 'image/jpeg', 'after', '2026-03-09 09:34:18'),
	(46, 'TK-34325', 'https://rgfs.bryansurio.workers.dev/tickets/before543213f6-cabc-447e-a432-b79c14442d98.jpg', '1000053910.jpg', '246038', 'image/jpeg', 'after', '2026-03-09 09:34:18'),
	(47, 'TK-34325', 'https://rgfs.bryansurio.workers.dev/tickets/beforea0d27dbe-50ff-4caa-8a0f-7a39cdd691a7.jpg', '1000053909.jpg', '239069', 'image/jpeg', 'after', '2026-03-09 09:34:19'),
	(48, 'TK-19663', 'https://rgfs.bryansurio.workers.dev/tickets/before4613417f-740c-439b-b128-2fb6d7c21d9c.jpg', '1000053917.jpg', '350305', 'image/jpeg', 'after', '2026-03-09 09:37:49'),
	(49, 'TK-19663', 'https://rgfs.bryansurio.workers.dev/tickets/before8f29f3b0-3cb7-4e37-b348-d3141068b741.jpg', '1000053918.jpg', '315944', 'image/jpeg', 'after', '2026-03-09 09:37:49'),
	(50, 'TK-19663', 'https://rgfs.bryansurio.workers.dev/tickets/before04154b72-244c-41db-b95c-91beab00a4fb.jpg', '1000053915.jpg', '292865', 'image/jpeg', 'after', '2026-03-09 09:37:50'),
	(51, 'TK-92466', 'https://rgfs.bryansurio.workers.dev/tickets/beforefaf4a57c-7e5b-4699-9744-5427f63c84d7.jpg', '1000053911.jpg', '522974', 'image/jpeg', 'after', '2026-03-09 09:40:09'),
	(52, 'TK-92466', 'https://rgfs.bryansurio.workers.dev/tickets/before355bd3ed-09b0-43ee-978c-9c36794b4288.jpg', '1000053910.jpg', '246038', 'image/jpeg', 'after', '2026-03-09 09:40:09'),
	(53, 'TK-92466', 'https://rgfs.bryansurio.workers.dev/tickets/before20415f60-3499-4243-9df5-18b8d1a49f89.jpg', '1000053909.jpg', '239069', 'image/jpeg', 'after', '2026-03-09 09:40:09'),
	(54, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/beforeb569f3ba-1027-494d-8086-bcc56165fccf.jpg', '1000053898.jpg', '278479', 'image/jpeg', 'before', '2026-03-09 09:57:08'),
	(55, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/before317369f8-ab80-45dd-8d71-bdd9813fa0ad.jpg', '1000053897.jpg', '443888', 'image/jpeg', 'before', '2026-03-09 09:57:08'),
	(56, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/beforecf46506f-875a-4980-a817-a161db1de515.jpg', '1000053896.jpg', '322873', 'image/jpeg', 'before', '2026-03-09 09:57:09'),
	(57, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/beforeb7c1cc4c-27f5-4335-9dbd-b64bdd0a7474.jpg', '1000053895.jpg', '371029', 'image/jpeg', 'before', '2026-03-09 09:57:09'),
	(58, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/before1fee2786-3d15-4360-beb9-614af83ec638.jpg', '1000053893.jpg', '258362', 'image/jpeg', 'before', '2026-03-09 09:57:10'),
	(59, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/before9dfb41ee-b608-4219-9419-34c1e68329e1.jpg', '1000054150.jpg', '358654', 'image/jpeg', 'after', '2026-03-09 09:57:43'),
	(60, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/before1daaed88-6936-4181-a8b2-f75a2525e004.jpg', '1000054147.jpg', '272083', 'image/jpeg', 'after', '2026-03-09 09:57:43'),
	(61, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/beforeec85fae1-8afc-4b41-99d3-49baaf631539.jpg', '1000054155.jpg', '319380', 'image/jpeg', 'after', '2026-03-09 09:57:43'),
	(62, 'TK-53882', 'https://rgfs.bryansurio.workers.dev/tickets/beforea30e1a7e-13b9-437b-8bc6-972b13c93797.jpg', '1000054154.jpg', '274367', 'image/jpeg', 'after', '2026-03-09 09:57:44'),
	(63, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/before3d41b58f-3205-4a8d-907a-4de2ea61373c.jpg', '1000053175.jpg', '276202', 'image/jpeg', 'before', '2026-03-09 10:01:06'),
	(64, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/beforec0e19245-43a9-4101-a451-f8d62d228722.jpg', '1000053174.jpg', '275256', 'image/jpeg', 'before', '2026-03-09 10:01:06'),
	(65, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/beforec69e1d21-43e7-4f36-9ca8-36acc3910c44.jpg', '1000054184.jpg', '249033', 'image/jpeg', 'after', '2026-03-09 10:01:30'),
	(66, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/before814a4a2f-906c-4b81-8513-505e45de565d.jpg', '1000054183.jpg', '354058', 'image/jpeg', 'after', '2026-03-09 10:01:30'),
	(67, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/before55e1c7a1-431b-4c08-8c4b-d02c301de754.jpg', '1000054181.jpg', '289644', 'image/jpeg', 'after', '2026-03-09 10:01:31'),
	(68, 'TK-80494', 'https://rgfs.bryansurio.workers.dev/tickets/beforeb0f53da8-ff0d-4b03-a5b4-b64fe2c2d18e.jpg', '1000054178.jpg', '254480', 'image/jpeg', 'after', '2026-03-09 10:01:31'),
	(69, 'TK-41718', 'https://rgfs.bryansurio.workers.dev/tickets/beforea32db167-5814-45ba-9052-b542e469ed4d.jpg', '1000053951.jpg', '322818', 'image/jpeg', 'after', '2026-03-09 10:03:06'),
	(70, 'TK-41718', 'https://rgfs.bryansurio.workers.dev/tickets/before6fc06270-bf3c-4826-8884-afaa00acd08d.jpg', '1000053949.jpg', '419604', 'image/jpeg', 'after', '2026-03-09 10:03:06'),
	(71, 'TK-31723', 'https://rgfs.bryansurio.workers.dev/tickets/before35047802-06d6-49d0-8b82-5eb394cbc7d3.jpg', '1000053175.jpg', '276202', 'image/jpeg', 'before', '2026-03-09 10:04:16'),
	(72, 'TK-31723', 'https://rgfs.bryansurio.workers.dev/tickets/beforeb52a572d-2950-4b55-9f1f-da9317d0b4de.jpg', '1000053174.jpg', '275256', 'image/jpeg', 'before', '2026-03-09 10:04:17'),
	(73, 'TK-31723', 'https://rgfs.bryansurio.workers.dev/tickets/before5649586b-a066-4045-9f77-c72d2894e520.jpg', '1000054184.jpg', '249033', 'image/jpeg', 'after', '2026-03-09 10:04:52'),
	(74, 'TK-31723', 'https://rgfs.bryansurio.workers.dev/tickets/before4b967bfb-4f93-4533-abaf-47ca8cf0f193.jpg', '1000054183.jpg', '354058', 'image/jpeg', 'after', '2026-03-09 10:04:53'),
	(75, 'TK-31723', 'https://rgfs.bryansurio.workers.dev/tickets/beforea1796b2f-7680-453a-84fb-3a21e6859448.jpg', '1000054178.jpg', '254480', 'image/jpeg', 'after', '2026-03-09 10:04:53'),
	(76, 'TK-11082', 'https://rgfs.bryansurio.workers.dev/tickets/beforec6381619-8d03-4b1d-91d7-b0f4799da951.png', '1000054372.png', '2677248', 'image/png', 'after', '2026-03-09 10:08:27'),
	(77, 'TK-11082', 'https://rgfs.bryansurio.workers.dev/tickets/before7cd26208-42e5-4f50-bf13-7ebeb99a4545.png', '1000054371.png', '2449809', 'image/png', 'after', '2026-03-09 10:08:28'),
	(78, 'TK-32906', 'https://rgfs.bryansurio.workers.dev/tickets/before3257194c-ac56-4904-a984-3c8eb63ae418.jpg', '1000054184.jpg', '249033', 'image/jpeg', 'after', '2026-03-09 10:13:10'),
	(79, 'TK-32906', 'https://rgfs.bryansurio.workers.dev/tickets/beforec6a7a9c1-a523-4a48-97c2-56e4e4896cfa.jpg', '1000054183.jpg', '354058', 'image/jpeg', 'after', '2026-03-09 10:13:10'),
	(80, 'TK-32906', 'https://rgfs.bryansurio.workers.dev/tickets/before8cfe6b14-eb3d-4305-9c12-0c1666925dc3.png', '1000054373.png', '4668364', 'image/png', 'before', '2026-03-09 10:17:06'),
	(83, 'TK-68429', 'https://rgfs.bryansurio.workers.dev/tickets/before02e6da0c-738a-48bd-bd50-50c6b11e7ab0.png', '1000054372.png', '2677248', 'image/png', 'after', '2026-03-10 02:09:09'),
	(84, 'TK-68429', 'https://rgfs.bryansurio.workers.dev/tickets/beforec1b3e7c0-a2b1-4ca8-b49d-3f1ebb8b38f0.png', '1000054371.png', '2449809', 'image/png', 'after', '2026-03-10 02:09:10'),
	(85, 'TK-59539', 'https://rgfs.bryansurio.workers.dev/tickets/beforee6a3f4d0-0d59-4e84-8cc7-b7912f705ee2.png', '1000054404.png', '331232', 'image/png', 'after', '2026-03-12 03:34:29'),
	(86, 'TK-33492', 'https://rgfs.bryansurio.workers.dev/tickets/beforedae1576b-2022-4972-80c5-7398bb93fbc6.jpg', '1000054405.jpg', '358858', 'image/jpeg', 'before', '2026-03-12 06:34:25'),
	(87, 'TK-33492', 'https://rgfs.bryansurio.workers.dev/tickets/before311150ea-81bd-48a2-b4d0-d7d2b8bd3797.jpg', '1000054407.jpg', '357231', 'image/jpeg', 'after', '2026-03-12 06:34:37'),
	(88, 'TK-33492', 'https://rgfs.bryansurio.workers.dev/tickets/beforeae7534af-8f06-42fd-aa22-bef18617f302.jpg', '1000054408.jpg', '390859', 'image/jpeg', 'after', '2026-03-12 06:34:37'),
	(89, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before974fc661-90d2-491d-a199-293ed5cc9ed6.jpg', '1000054421.jpg', '367540', 'image/jpeg', 'after', '2026-03-12 07:23:21'),
	(90, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before269a8f92-2688-42de-80dd-a428e3fc3817.jpg', '1000054422.jpg', '316965', 'image/jpeg', 'after', '2026-03-12 07:23:22'),
	(91, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before31344fd9-eddf-4866-8b34-e787ae8640a7.jpg', '1000054423.jpg', '892849', 'image/jpeg', 'after', '2026-03-12 07:23:22'),
	(92, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before642a5ddc-f15e-4746-a0bb-c1e0bdc8c577.jpg', '1000054419.jpg', '245364', 'image/jpeg', 'after', '2026-03-12 07:23:22'),
	(93, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before3e9f8379-8735-44b8-ac0a-94a17aa63750.jpg', '1000054420.jpg', '298076', 'image/jpeg', 'after', '2026-03-12 07:23:23'),
	(98, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/beforef1d0d917-71d6-42c9-95b0-e7d890a640b9.jpg', '1000054412.jpg', '378297', 'image/jpeg', 'after', '2026-03-13 01:27:27'),
	(99, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/before62bfd6b8-e5dc-4416-a011-db02ed5f2ae6.jpg', '1000054413.jpg', '366774', 'image/jpeg', 'after', '2026-03-13 01:27:28'),
	(100, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/beforec2c8e5da-b0b1-4e8b-9624-d2066b7bfc84.jpg', '1000054417.jpg', '279030', 'image/jpeg', 'after', '2026-03-13 01:27:28'),
	(101, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/before1a18f1bc-ebb9-41ef-8d09-b57517adf69d.jpg', '1000054412.jpg', '378297', 'image/jpeg', 'before', '2026-03-13 01:28:49'),
	(102, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/beforec7968945-952b-43b8-9d1c-11a9ed63e8da.jpg', '1000054413.jpg', '366774', 'image/jpeg', 'before', '2026-03-13 01:28:49'),
	(103, 'TK-67462', 'https://rgfs.bryansurio.workers.dev/tickets/before256a6b0d-c11b-4f29-b357-511a008fbd93.jpg', '1000054415.jpg', '478539', 'image/jpeg', 'after', '2026-03-13 01:28:56'),
	(104, 'TK-98190', 'https://rgfs.bryansurio.workers.dev/tickets/before4963393e-f4e2-41ae-bf0c-03d027007244.jpg', '1000054422.jpg', '316965', 'image/jpeg', 'before', '2026-03-13 01:29:31');

-- Dumping structure for table ticketing-system.tickets_conversations
CREATE TABLE IF NOT EXISTS `tickets_conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tickets_id` char(50) DEFAULT NULL,
  `user_role` varchar(50) DEFAULT NULL,
  `sender_email` varchar(50) DEFAULT NULL,
  `sender_name` varchar(50) DEFAULT NULL,
  `message_body` longtext,
  `is_updated` tinyint DEFAULT '0',
  `is_inbound` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_conversations_tickets` (`tickets_id`),
  CONSTRAINT `FK_tickets_conversations_tickets` FOREIGN KEY (`tickets_id`) REFERENCES `tickets` (`reference_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_conversations: ~79 rows (approximately)
INSERT INTO `tickets_conversations` (`id`, `tickets_id`, `user_role`, `sender_email`, `sender_name`, `message_body`, `is_updated`, `is_inbound`, `created_at`) VALUES
	(389, 'TK-71420', 'Customer', 'mariaanne.mestica@deped.gov.ph', 'Maria Anne Mestica', 'No internet in access point', 0, 1, '2026-02-12 06:05:51'),
	(390, 'TK-30206', 'Customer', 'rizzajoy.alido@depedmakati.ph', 'Rizza Joy Alido', 'NOT CHARGING', 0, 1, '2026-02-12 06:45:46'),
	(391, 'TK-99697', 'Customer', 'mariacriselda.bautista@deped.gov.ph', 'Maria Criselda G. Bautista', 'Blue Screen Pop Up', 0, 1, '2026-02-12 09:35:41'),
	(392, 'TK-71420', 'Customer', 'mariaanne.mestica@deped.gov.ph', 'Maria Anne Mestica', 'Good morning! \r\n', 0, 1, '2026-02-13 01:20:14'),
	(393, 'TK-71420', 'Technician', 'mariaanne.mestica@deped.gov.ph', 'Rd Abuan', 'Hello Good day ma\'am, \r\nFor schedule na po ito for visit, thank you po', 0, 0, '2026-02-13 07:01:44'),
	(394, 'TK-32946', 'Customer', 'marielle.buendia@depedmakati.ph', 'Marielle Buendia', 'Black Screen', 0, 1, '2026-02-13 07:27:00'),
	(395, 'TK-99697', 'Technician', 'mariacriselda.bautista@deped.gov.ph', 'Rd Abuan', 'Hello Good Day,\r\nSchedule na po ito for visit next week\r\nThank you!\r\n', 0, 0, '2026-02-13 07:43:35'),
	(396, 'TK-30206', 'Technician', 'rizzajoy.alido@depedmakati.ph', 'Rd Abuan', 'Hello Good Day,\r\nSchedule na po ito for visit next week\r\nThank you!', 0, 0, '2026-02-13 07:44:16'),
	(397, 'TK-32946', 'Technician', 'marielle.buendia@depedmakati.ph', 'Rd Abuan', 'Hello Good Day,\r\nSchedule na po ito for visit next week\r\nThank you!', 0, 0, '2026-02-13 07:44:28'),
	(398, 'TK-48500', 'Customer', 'shielamae.roson@deped.gov.ph', 'Shiela Mae Roson', 'Windows not working even after performing basic troubleshoot.', 0, 1, '2026-02-13 07:48:50'),
	(399, 'TK-66325', 'Customer', 'marielle.buendia@depedmakati.ph', 'Marielle Buendia', 'Not working ', 0, 1, '2026-02-13 08:07:50'),
	(400, 'TK-70117', 'Customer', 'marielle.buendia@depedmakati.ph', 'Marielle Buendia', 'Two UPS are not working. ', 0, 1, '2026-02-13 08:08:51'),
	(401, 'TK-71420', 'Customer', 'mariaanne.mestica@deped.gov.ph', 'Maria Anne Mestica', 'Thank you po', 0, 1, '2026-02-13 09:01:13'),
	(402, 'TK-48500', 'Technician', 'shielamae.roson@deped.gov.ph', 'Rd Abuan', 'Hello Good Day, \r\nMay I confirm if the unit is 75" or 105" ?\r\nand what is the basic troubleshooting you done ?\r\nThank you.', 0, 0, '2026-02-16 02:22:15'),
	(403, 'TK-70117', 'Technician', 'marielle.buendia@depedmakati.ph', 'Rd Abuan', 'Good Day! Schedule na po ito this week, Thank you!', 0, 0, '2026-02-16 05:04:37'),
	(404, 'TK-66325', 'Technician', 'marielle.buendia@depedmakati.ph', 'Rd Abuan', 'Good Day! Scheduled na po ito for visit onsite this week, Thank you!', 0, 0, '2026-02-16 05:05:51'),
	(405, 'TK-48500', 'Customer', 'shielamae.roson@deped.gov.ph', 'Shiela Mae Roson', 'Good day, I\'m not really sure about the measurement. But it is the  usual Beesee TV that you have installed in every classroom of Hen. Pio del Pilar ES. Main. The teacher assigned to that classroom already restarted the unit. The TV has a notification that says: MACHINE CHECK EXCEPTION. ', 0, 1, '2026-02-16 09:22:03'),
	(406, 'TK-48500', 'Technician', 'shielamae.roson@deped.gov.ph', 'Rd Abuan', 'Good Day!, This is scheduled this week for onsite support, Thank you!', 0, 0, '2026-02-16 10:55:52'),
	(407, 'TK-12437', 'Customer', 'krizzajoy.herrella@deped.gov.ph', 'Krizza Herrella', '311-B broken plug. ', 0, 1, '2026-02-18 01:51:38'),
	(408, 'TK-10810', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'Flickering power', 0, 1, '2026-02-18 07:18:22'),
	(409, 'TK-85459', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'BLACK SCREEN FADING, UPS NOT CHARGING', 0, 1, '2026-02-18 07:19:34'),
	(410, 'TK-12933', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'TV NO POWER', 0, 1, '2026-02-18 07:23:33'),
	(411, 'TK-22790', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'NO POWER', 0, 1, '2026-02-18 07:24:27'),
	(412, 'TK-61361', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'BYTELLO NOT CONNECTED', 0, 1, '2026-02-18 07:26:03'),
	(413, 'TK-90670', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'NO POWER', 0, 1, '2026-02-18 07:26:51'),
	(414, 'TK-19663', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'NO POWER IN POWER STRIP AND POWER SOURCE', 0, 1, '2026-02-18 07:28:04'),
	(415, 'TK-92466', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'NO INTERNET CONNECTION', 0, 1, '2026-02-18 07:30:20'),
	(416, 'TK-27776', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'NO POWER', 0, 1, '2026-02-18 07:35:23'),
	(417, 'TK-34325', 'Customer', 'ricamae.villacorta@deped.gov.ph', 'Rica Mae E. Villacorta', 'Cannot connect to the wifi', 0, 1, '2026-02-18 07:47:05'),
	(418, 'TK-36461', 'Customer', 'rubyaniciete@yahoo.com', 'RUBY ANICIETE', 'Goodmorning po Ma\'am, report ko lang po ayaw po gumana po ng tv namin sa Santiago. Baka po ung CPU po niya ang ayaw. nagamit ko po siya ng first period pero nung second period kay Maam Tina na ayaw na po gumana. Salamat po', 0, 1, '2026-02-18 08:33:48'),
	(419, 'TK-53882', 'Customer', 'marygrace.elle001@deped.gov.ph', 'Mary Grace Elle', 'Broken tempered glass', 0, 1, '2026-02-19 02:24:24'),
	(420, 'TK-19693', 'Customer', 'kevin.bunagan@deped.gov.ph', 'Kevin P. Bunagan', 'Ayaw po gumana ng windows po', 0, 1, '2026-02-19 07:07:28'),
	(421, 'TK-59982', 'Customer', '136690@deped.gov.ph', 'Kevin P. Bunagan', 'PC function is not working', 0, 1, '2026-02-19 07:07:57'),
	(422, 'TK-11082', 'Customer', '305406@DEPED.GOV.PH', 'KRIZZA BUCIA', 'NO POWER ON', 0, 1, '2026-02-19 07:36:11'),
	(423, 'TK-41718', 'Customer', '305406@DEPED.GOV.PH', 'KRIZZA BUCIA', 'PALAGING NAGDIDISCONNECT', 0, 1, '2026-02-19 07:38:25'),
	(424, 'TK-68429', 'Customer', '305406@DEPED.GOV.PH', 'KRIZZA BUCIA', 'NO POWER ON', 0, 1, '2026-02-19 07:39:16'),
	(425, 'TK-36641', 'Customer', 'jenelynaagbay@gmail.com', 'Jenelyn Agbay', 'The screen is still black even the device power is turned on', 0, 1, '2026-02-20 03:42:53'),
	(426, 'TK-80494', 'Customer', 'jenelynaagbay@gmail.com', 'Jenelyn Agbay', 'The screen splitted and it mirrors the other half', 0, 1, '2026-02-20 03:50:18'),
	(427, 'TK-31723', 'Customer', 'jenelynaagbay@gmail.com', 'Jenelyn Agbay', 'The screen splitted and it mirrors the other half', 0, 1, '2026-02-20 03:50:29'),
	(428, 'TK-32906', 'Customer', '136691@deped.gov.ph', 'JUNA ASPACIO PALMISA', 'SPLIT SCREEN', 0, 1, '2026-02-20 07:14:22'),
	(429, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'Unifi Access Point Password per Room. Need Password. ', 0, 1, '2026-02-20 10:26:05'),
	(430, 'TK-12437', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'Rd Abuan', 'Hello Good Day, for schedule na po ito palitan na lang po yung power cord, Thank you', 0, 0, '2026-02-23 02:01:43'),
	(431, 'TK-59539', 'Customer', 'sabanganruthie13@gmail.com', 'Ruth at. Sabangan', 'Locked TV', 0, 1, '2026-02-23 03:19:26'),
	(432, 'TK-59539', 'Technician', 'sabanganruthie13@gmail.com', 'Rd Abuan', 'Hello po ma\'am Good morning, check po sa remote pa press po ng red button, thank you!', 0, 0, '2026-02-23 03:23:20'),
	(433, 'TK-59539', 'Technician', 'sabanganruthie13@gmail.com', 'Rd Abuan', '', 0, 0, '2026-02-23 03:31:28'),
	(434, 'TK-16056', 'Technician', 'rocky.gabitanan@deped.gov.ph', 'Rd Abuan', 'Hello Good Day, Here\'s the password for the unifi access point, \r\n"SANHS\r\nPASSWORD: S@N@NT0N10NHS2023"	\r\n"SANHS_FACULTY\r\nPASSWORD: S@N@NT0N10HS2023faculty"	\r\n"SANHS_ADMIN\r\nPASSWORD: S@N@NT0N10HS2023admin"	\r\n"SANHS_GUEST\r\nPASSWORD: S@N@NT0N10HS1234"', 0, 0, '2026-02-23 03:54:21'),
	(435, 'TK-71420', 'Customer', 'mariaanne.mestica@deped.gov.ph', 'Maria Anne Mestica', 'Good afternoon po. Follow up lang po for the schedule of visit po. Thank you!\r\n\r\n', 0, 1, '2026-02-23 04:10:24'),
	(436, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'San Antonio Village Elementary School po kami. I HAVE those password po sa admin, faculty and guest. What I need po is the password per classroom po. I am seeing wifi signal  per room number however we do not know the word.', 0, 1, '2026-02-23 04:34:06'),
	(437, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'And also, can I please ask if you can visit us here to check if the unified WiFi is properly connected to our new WiFi ISP.. ', 0, 1, '2026-02-23 04:35:26'),
	(438, 'TK-16056', 'SysAdmin', 'rocky.gabitanan@deped.gov.ph', 'Thinz Calizar', 'Good day! Sir, can you please provide a picture / screenshot of those WiFi Signal? Thank you.', 0, 0, '2026-02-23 05:39:49'),
	(445, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'Ahh okay wait lang po. Ahhm. Pwede din po ba kayo magvisit to check on how can we properly connect the unified doon sa bago namin ISP po..', 0, 1, '2026-02-23 08:54:35'),
	(450, 'TK-16056', 'SysAdmin', 'rocky.gabitanan@deped.gov.ph', 'Thinz Calizar', 'Good pm po.. This is Thinz, May I know the status of this? Do you still need assistance from us?', 0, 0, '2026-02-25 06:56:13'),
	(451, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'Ayon wla parin po nagyari.  Di ko parin po magamit ang Unifi', 0, 1, '2026-02-25 06:58:15'),
	(452, 'TK-16056', 'SysAdmin', 'rocky.gabitanan@deped.gov.ph', 'Thinz Calizar', 'Technical support ko po muna kayo para madeploy ko po un Technician ko.. ano po ba un status now? Normally, it should be plug and play po kasi..', 0, 0, '2026-02-25 07:02:37'),
	(453, 'TK-16056', 'SysAdmin', 'rocky.gabitanan@deped.gov.ph', 'Thinz Calizar', 'If ever po papuntahin ko un Technician ko today, may mag accommodate pa po ba or Friday Morning is okay with you?', 0, 0, '2026-02-25 07:03:35'),
	(455, 'TK-48500', 'Customer', 'shielamae.roson@deped.gov.ph', 'Shiela Mae Roson', 'Good day, just checking in about our scheduled onsite visit for the Beesee TV. Could you please confirm the date and time? ', 0, 1, '2026-02-25 07:30:41'),
	(460, 'TK-59982', 'SysAdmin', '136690@deped.gov.ph', 'Thinz Calizar', 'Good Morning, please be inform that an Technician will be going to repair the said issue, thank you.', 0, 0, '2026-02-26 02:23:32'),
	(461, 'TK-16056', 'SysAdmin', 'rocky.gabitanan@deped.gov.ph', 'Thinz Calizar', 'Good Morning, please be inform that an Technician will be going to repair the said issue, thank you.', 0, 0, '2026-02-26 02:23:46'),
	(462, 'TK-59982', 'Customer', '136690@deped.gov.ph', 'Kevin P. Bunagan', 'When is the possible date of repair maam/sir.', 0, 1, '2026-02-26 02:30:26'),
	(463, 'TK-12437', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', NULL, 1, 0, '2026-02-26 02:37:55'),
	(464, 'TK-12437', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', NULL, 1, 0, '2026-02-26 02:38:13'),
	(466, 'TK-59982', 'SysAdmin', '136690@deped.gov.ph', 'Thinz Calizar', 'Good day.. This is today po.. 02/26/26. Please inform us here if, technician is no show. thank you.', 0, 0, '2026-02-26 03:13:13'),
	(467, 'TK-19693', 'SysAdmin', 'kevin.bunagan@deped.gov.ph', 'Thinz Calizar', 'This ticket will be close/delete. this is similar to Ticket ID #TK-59982. Thank you.', 0, 0, '2026-02-26 03:13:51'),
	(468, 'TK-16056', 'Customer', 'rocky.gabitanan@deped.gov.ph', 'ROCKY LLANERA GABITANAN', 'Good eve. SLR po.\r\nThe system is now properly working. Inayos na po ng technician na mailipat ang network cable sa cabinet doon sa ISP router. Thanks po. We can now utilise the Interactive TV and Tablet.', 0, 1, '2026-02-26 14:17:51'),
	(469, 'TK-67462', 'Customer', 'krizzajoy.herrella@deped.gov.ph', 'Krizza Bucia', 'Not Working/ No Power  Indication', 0, 1, '2026-03-03 08:28:21'),
	(470, 'TK-67462', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', 'Hello Good, Morning po ma\'am, Please check if the main switch of 75" Educational TV is turned on, Thank you', 0, 0, '2026-03-04 01:31:02'),
	(472, 'TK-67462', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', 'Hello po ma\'am Good day, ask lang po ng update sa reported unit ?', 0, 0, '2026-03-09 06:15:35'),
	(473, 'TK-33492', 'Customer', 'marygrace.elle001@deped.gov.ph', 'Mary Grace Elle', 'A Recovery Blue Screen Appears When Switching To Pc Mode.', 0, 1, '2026-03-10 01:46:08'),
	(474, 'TK-33492', 'Technician', 'marygrace.elle001@deped.gov.ph', 'RD Abuan', 'Hello Good day ma\'am, for schedule na po ito, as of now wag na lang po muna galawin yung pc mode ng 75" educational TV bali wait na lang po sa availability ni technician para ma visit po ito onsite, thank you', 0, 0, '2026-03-10 02:01:41'),
	(475, 'TK-59539', 'Technician', 'sabanganruthie13@gmail.com', 'RD Abuan', 'Hello Good Day ma\'am, Ask lang po if okay na po ang concern ma\'am ? \r\nThank you', 0, 0, '2026-03-10 02:13:03'),
	(481, 'TK-67462', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', NULL, 1, 0, '2026-03-12 01:39:13'),
	(482, 'TK-33492', 'Technician', 'marygrace.elle001@deped.gov.ph', 'RD Abuan', NULL, 1, 0, '2026-03-12 02:10:43'),
	(483, 'TK-98190', 'Customer', 'sheryl.modrigo@deped.gov.ph', 'Sheryl Modrigo', 'Wala Pong Power Ang Tv ', 0, 1, '2026-03-12 07:03:26'),
	(484, 'TK-98190', 'Technician', 'sheryl.modrigo@deped.gov.ph', 'RD Abuan', NULL, 1, 0, '2026-03-12 07:07:47'),
	(485, 'TK-20245', 'Customer', 'christian.tejada@deped.gov.ph', 'Christian Tejada', 'Need To Change The Wifi Password\n', 0, 1, '2026-03-13 04:19:00'),
	(486, 'TK-20245', 'Developer', 'christian.tejada@deped.gov.ph', 'Joshua Santos', 'good pm open nyo lang unifi app sa server input nyo lang po email and password to access site ', 0, 0, '2026-03-13 05:39:36'),
	(487, 'TK-53608', 'Customer', 'rubyaniciete@yahoo.com', 'Ruby Aniciete', 'Once It Was Plug-in To The Outlet There Is A Beep Noise Coming From The Ups And Even It Is Unplug To The Outlet.', 0, 1, '2026-03-16 00:47:09'),
	(489, 'TK-78295', 'Customer', 'krizzajoy.herrella@deped.gov.ph', 'Krizza Bucia', 'Light Indicator Or Display From Red To White  ', 0, 1, '2026-03-18 04:19:15'),
	(490, 'TK-78295', 'Technician', 'krizzajoy.herrella@deped.gov.ph', 'RD Abuan', 'Hello Good Day,\r\n\r\nThank you for your message. We are currently reviewing your concern and will update you shortly.', 0, 0, '2026-03-18 09:09:03');

-- Dumping structure for table ticketing-system.tickets_conversation_attachment
CREATE TABLE IF NOT EXISTS `tickets_conversation_attachment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_conversation_id` int DEFAULT NULL,
  `attachment_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `file_name` longtext,
  `file_size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `file_type` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_conversation_attachment_tickets_conversations` (`ticket_conversation_id`),
  CONSTRAINT `FK_tickets_conversation_attachment_tickets_conversations` FOREIGN KEY (`ticket_conversation_id`) REFERENCES `tickets_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_conversation_attachment: ~6 rows (approximately)
INSERT INTO `tickets_conversation_attachment` (`id`, `ticket_conversation_id`, `attachment_url`, `file_name`, `file_size`, `file_type`, `created_at`) VALUES
	(77, 433, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/5058b632-eea5-4490-9432-5e2a3c4eef09.jfif', '0e5da09f-b255-462a-a295-94847d35bd09.jfif', '617885', 'image/jpeg', '2026-02-23 03:31:30'),
	(92, 463, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/c51afb93-916a-4976-b38d-da8a246bc0eb.pdf', 'JobOrder-TK-12437.pdf', '76545', 'application/pdf', '2026-02-26 02:37:56'),
	(93, 464, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/e94be99d-8252-48f8-ad66-82da18741825.pdf', 'JobOrder-TK-12437.pdf', '76545', 'application/pdf', '2026-02-26 02:38:13'),
	(100, 481, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/e2d38160-3f6a-47e8-9635-2a79532c20e8.pdf', 'JobOrder-TK-67462.pdf', '77125', 'application/pdf', '2026-03-12 01:39:14'),
	(101, 482, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/bf92a632-c2d8-4594-b4dc-9196984d26c6.pdf', 'JobOrder-TK-33492.pdf', '77177', 'application/pdf', '2026-03-12 02:10:43'),
	(102, 484, 'https://rgfs.bryansurio.workers.dev/ticket_attachment/5bd4f9bc-6140-459b-a903-300c981e3bf8.pdf', 'JobOrder-TK-98190.pdf', '77095', 'application/pdf', '2026-03-12 07:07:48');

-- Dumping structure for table ticketing-system.tickets_images
CREATE TABLE IF NOT EXISTS `tickets_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tickets_id` int DEFAULT NULL,
  `image_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__tickets` (`tickets_id`),
  CONSTRAINT `FK__tickets` FOREIGN KEY (`tickets_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_images: ~8 rows (approximately)
INSERT INTO `tickets_images` (`id`, `tickets_id`, `image_url`, `created_at`, `updated_at`) VALUES
	(56, 197, 'https://rgfs.bryansurio.workers.dev/tickets/9fa3c41b-6a4e-4665-b52b-00ac769a7237.jfif', '2026-02-12 09:35:42', NULL),
	(57, 202, 'https://rgfs.bryansurio.workers.dev/tickets/ca00171a-4fe8-4a5c-81ff-aa44a45605c2.jpg', '2026-02-18 01:51:39', NULL),
	(58, 227, 'https://rgfs.bryansurio.workers.dev/tickets/9f40c6a2-ef02-43de-83cd-995c361b4b24.jpg', '2026-03-03 08:28:21', NULL),
	(59, 228, 'https://rgfs.bryansurio.workers.dev/tickets/d1a2a1a6-905b-4009-ad99-a9891292f6ab.jpeg', '2026-03-10 01:46:11', NULL),
	(60, 229, 'https://rgfs.bryansurio.workers.dev/tickets/0448f674-674a-436f-80df-fdc455d9e8b4.PNG', '2026-03-12 07:03:27', NULL),
	(61, 230, 'https://rgfs.bryansurio.workers.dev/tickets/e4ccce0f-ed9c-45c1-b862-2732585e5ba8.jpg', '2026-03-13 04:19:01', NULL),
	(62, 231, 'https://rgfs.bryansurio.workers.dev/tickets/01d4f19a-24f3-4d2b-afbc-4fa44612a5ed.jpeg', '2026-03-16 00:47:12', NULL),
	(64, 233, 'https://rgfs.bryansurio.workers.dev/tickets/81bf3596-5a87-440d-a851-fea8fb5c96d3.jfif', '2026-03-18 04:19:16', NULL);

-- Dumping structure for table ticketing-system.tickets_job_orders
CREATE TABLE IF NOT EXISTS `tickets_job_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tickets_id` int DEFAULT NULL,
  `attachment_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `file_name` longtext,
  `file_size` longtext,
  `file_type` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_job_orders_tickets` (`tickets_id`),
  CONSTRAINT `FK_tickets_job_orders_tickets` FOREIGN KEY (`tickets_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_job_orders: ~34 rows (approximately)
INSERT INTO `tickets_job_orders` (`id`, `tickets_id`, `attachment_url`, `file_name`, `file_size`, `file_type`, `created_at`, `updated_at`) VALUES
	(126, 195, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-71420.pdf', NULL, NULL, NULL, '2026-02-12 06:05:49', '2026-02-25 05:30:25'),
	(127, 196, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-30206.pdf', NULL, NULL, NULL, '2026-02-12 06:45:44', '2026-02-25 05:30:25'),
	(128, 197, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-99697.pdf', NULL, NULL, NULL, '2026-02-12 09:35:39', '2026-02-25 05:30:25'),
	(129, 198, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-32946.pdf', NULL, NULL, NULL, '2026-02-13 07:26:58', '2026-02-25 05:30:25'),
	(130, 199, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-48500.pdf', NULL, NULL, NULL, '2026-02-13 07:48:49', '2026-02-25 05:30:25'),
	(131, 200, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-66325.pdf', NULL, NULL, NULL, '2026-02-13 08:07:49', '2026-02-25 05:30:25'),
	(132, 201, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-70117.pdf', NULL, NULL, NULL, '2026-02-13 08:08:49', '2026-02-25 05:30:25'),
	(133, 202, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrder-TK-12437-61760', 'JobOrder-TK-12437.pdf', '76545', 'application/pdf', '2026-02-18 01:51:36', '2026-02-26 02:38:13'),
	(134, 203, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-10810.pdf', NULL, NULL, NULL, '2026-02-18 07:18:20', '2026-02-25 05:30:25'),
	(135, 204, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-85459.pdf', NULL, NULL, NULL, '2026-02-18 07:19:32', '2026-02-25 05:30:25'),
	(136, 205, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-12933.pdf', NULL, NULL, NULL, '2026-02-18 07:23:31', '2026-02-25 05:30:25'),
	(137, 206, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-22790.pdf', NULL, NULL, NULL, '2026-02-18 07:24:26', '2026-02-25 05:30:25'),
	(138, 207, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-61361.pdf', NULL, NULL, NULL, '2026-02-18 07:26:00', '2026-02-25 05:30:25'),
	(139, 208, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-90670.pdf', NULL, NULL, NULL, '2026-02-18 07:26:50', '2026-02-25 05:30:25'),
	(140, 209, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-19663.pdf', NULL, NULL, NULL, '2026-02-18 07:28:02', '2026-02-25 05:30:25'),
	(141, 210, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-92466.pdf', NULL, NULL, NULL, '2026-02-18 07:30:19', '2026-02-25 05:30:25'),
	(142, 211, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-27776.pdf', NULL, NULL, NULL, '2026-02-18 07:35:22', '2026-02-25 05:30:25'),
	(143, 212, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-34325.pdf', NULL, NULL, NULL, '2026-02-18 07:47:04', '2026-02-25 05:30:25'),
	(144, 213, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-36461.pdf', NULL, NULL, NULL, '2026-02-18 08:33:47', '2026-02-25 05:30:25'),
	(145, 214, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-53882.pdf', NULL, NULL, NULL, '2026-02-19 02:24:22', '2026-02-25 05:30:25'),
	(146, 215, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-19693.pdf', NULL, NULL, NULL, '2026-02-19 07:07:27', '2026-02-25 05:30:25'),
	(147, 216, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-59982.pdf', NULL, NULL, NULL, '2026-02-19 07:07:56', '2026-02-25 05:30:25'),
	(148, 217, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-11082.pdf', NULL, NULL, NULL, '2026-02-19 07:36:10', '2026-02-25 05:30:25'),
	(149, 218, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-41718.pdf', NULL, NULL, NULL, '2026-02-19 07:38:24', '2026-02-25 05:30:25'),
	(150, 219, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-68429.pdf', NULL, NULL, NULL, '2026-02-19 07:39:15', '2026-02-25 05:30:25'),
	(151, 220, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-36641.pdf', NULL, NULL, NULL, '2026-02-20 03:42:51', '2026-02-25 05:30:25'),
	(152, 221, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-80494.pdf', NULL, NULL, NULL, '2026-02-20 03:50:16', '2026-02-25 05:30:25'),
	(153, 222, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-31723.pdf', NULL, NULL, NULL, '2026-02-20 03:50:27', '2026-02-25 05:30:25'),
	(154, 223, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-32906.pdf', NULL, NULL, NULL, '2026-02-20 07:14:20', '2026-02-25 05:30:25'),
	(155, 224, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-16056.pdf', NULL, NULL, NULL, '2026-02-20 10:26:03', '2026-02-25 05:30:25'),
	(156, 225, 'https://rgfs.bryansurio.workers.dev/job-orders/TK-59539.pdf', NULL, NULL, NULL, '2026-02-23 03:19:25', '2026-02-25 05:30:25'),
	(158, 227, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrder-TK-67462-755087', 'JobOrder-TK-67462.pdf', '77125', 'application/pdf', '2026-03-10 05:40:05', '2026-03-12 01:39:14'),
	(159, 228, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrder-TK-33492-901778', 'JobOrder-TK-33492.pdf', '77177', 'application/pdf', '2026-03-11 07:23:54', '2026-03-12 02:10:44'),
	(160, 229, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrder-TK-98190-202044', 'JobOrder-TK-98190.pdf', '77095', 'application/pdf', '2026-03-12 07:07:48', '2026-03-12 07:07:47');

-- Dumping structure for table ticketing-system.tickets_job_order_finish
CREATE TABLE IF NOT EXISTS `tickets_job_order_finish` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tickets_id` int DEFAULT NULL,
  `attachment_url` longtext,
  `file_name` longtext,
  `file_size` longtext,
  `file_type` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tjof_ticket` (`tickets_id`),
  CONSTRAINT `fk_tjof_ticket` FOREIGN KEY (`tickets_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.tickets_job_order_finish: ~25 rows (approximately)
INSERT INTO `tickets_job_order_finish` (`id`, `tickets_id`, `attachment_url`, `file_name`, `file_size`, `file_type`, `created_at`, `updated_at`) VALUES
	(2, 224, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-16056', 'IMG_20260226_175111.pdf', '152259', 'application/pdf', '2026-03-02 02:58:58', '2026-03-02 02:58:57'),
	(3, 215, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-19693', 'Makati es replacement.pdf', '156345', 'application/pdf', '2026-03-03 02:21:02', '2026-03-03 02:21:01'),
	(4, 223, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-32906', 'san jose es replacement.pdf', '154216', 'application/pdf', '2026-03-03 02:22:44', '2026-03-03 02:22:43'),
	(5, 202, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-12437', 'IMG_20260303_110804.pdf', '152173', 'application/pdf', '2026-03-03 03:14:35', '2026-03-03 03:14:35'),
	(6, 216, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-59982', 'Makati es replacement.pdf', '156345', 'application/pdf', '2026-03-03 03:18:08', '2026-03-03 03:18:07'),
	(7, 204, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-85459', 'La Paz ES replacement.pdf', '150995', 'application/pdf', '2026-03-03 03:19:42', '2026-03-03 03:19:41'),
	(8, 213, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-36461', 'IMG_20260303_115833.pdf', '185194', 'application/pdf', '2026-03-03 04:01:41', '2026-03-03 04:01:40'),
	(9, 220, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-36641', 'San Antonio NHS replacement.pdf', '150156', 'application/pdf', '2026-03-03 04:03:14', '2026-03-03 04:03:14'),
	(10, 199, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-48500-396524', 'IMG_20260303_154953.jpg', '575729', 'image/jpeg', '2026-03-03 08:39:54', '2026-03-03 08:39:54'),
	(11, 195, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-71420-133476', 'IMG_20260303_163336.jpg', '506892', 'image/jpeg', '2026-03-03 08:40:42', '2026-03-03 08:40:41'),
	(12, 203, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-10810-250286', 'IMG_20260224_112931.jpg', '619563', 'image/jpeg', '2026-03-04 08:13:01', '2026-03-04 08:13:00'),
	(13, 212, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-34325-248732', 'IMG_20260224_112949.jpg', '593100', 'image/jpeg', '2026-03-04 08:15:26', '2026-03-04 08:15:26'),
	(14, 205, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-12933-608518', 'IMG_20260224_112902.jpg', '643489', 'image/jpeg', '2026-03-04 08:16:19', '2026-03-04 08:16:18'),
	(15, 207, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-61361-185160', 'IMG_20260224_112910.jpg', '610173', 'image/jpeg', '2026-03-04 08:17:07', '2026-03-04 08:17:06'),
	(16, 209, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-19663-272504', 'IMG_20260304_162705.jpg', '474211', 'image/jpeg', '2026-03-04 08:40:30', '2026-03-04 08:40:29'),
	(17, 210, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-92466-879758', 'IMG_20260224_113016.jpg', '588655', 'image/jpeg', '2026-03-04 08:41:54', '2026-03-04 08:41:54'),
	(18, 218, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-41718-82572', 'IMG_20260224_115018.jpg', '577638', 'image/jpeg', '2026-03-04 08:45:12', '2026-03-04 08:45:11'),
	(19, 222, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-31723-499464', 'IMG_20260224_120652.jpg', '527166', 'image/jpeg', '2026-03-04 08:48:55', '2026-03-04 08:48:55'),
	(20, 221, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-80494-1047', 'IMG_20260224_120652.jpg', '527166', 'image/jpeg', '2026-03-04 08:49:18', '2026-03-04 08:49:17'),
	(21, 217, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-11082-83383', 'IMG_20260224_115037.jpg', '587395', 'image/jpeg', '2026-03-06 04:05:36', '2026-03-06 04:05:35'),
	(22, 197, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-99697-523678', 'IMG_20260303_154953.jpg', '575729', 'image/jpeg', '2026-03-06 04:36:41', '2026-03-06 04:36:41'),
	(23, 219, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-68429-768606', 'IMG_20260224_115037.jpg', '587395', 'image/jpeg', '2026-03-10 02:10:15', '2026-03-10 02:10:14'),
	(24, 228, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-33492-762016', 'IMG_20260312_143353.jpg', '517912', 'image/jpeg', '2026-03-12 06:34:56', '2026-03-12 06:34:56'),
	(25, 227, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-67462-944476', 'IMG_20260312_152033.jpg', '535275', 'image/jpeg', '2026-03-12 07:25:22', '2026-03-12 07:25:21'),
	(26, 229, 'https://rgfs.bryansurio.workers.dev/ticket/job-order/JobOrderFinish-TK-98190-664996', 'IMG_20260312_151745.jpg', '473315', 'image/jpeg', '2026-03-12 07:25:59', '2026-03-12 07:25:59');

-- Dumping structure for table ticketing-system.ticket_activity_logs
CREATE TABLE IF NOT EXISTS `ticket_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tickets_id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ticket_conversation_id` int DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `categories_id_old` int DEFAULT NULL,
  `categories_id_new` int DEFAULT NULL,
  `products_id_old` int DEFAULT NULL,
  `products_id_new` int DEFAULT NULL,
  `issues_id_old` int DEFAULT NULL,
  `issues_id_new` int DEFAULT NULL,
  `item_name_old` varchar(255) DEFAULT NULL,
  `item_name_new` varchar(255) DEFAULT NULL,
  `serial_number_old` varchar(255) DEFAULT NULL,
  `serial_number_new` varchar(255) DEFAULT NULL,
  `location_old` varchar(255) DEFAULT NULL,
  `location_new` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categories_id_old` (`categories_id_old`),
  KEY `categories_id_new` (`categories_id_new`),
  KEY `products_id_old` (`products_id_old`),
  KEY `products_id_new` (`products_id_new`),
  KEY `issues_id_old` (`issues_id_old`),
  KEY `issues_id_new` (`issues_id_new`),
  KEY `FK_ticket_activity_logs_tickets_conversations` (`ticket_conversation_id`),
  KEY `FK_ticket_activity_logs_tickets` (`tickets_id`),
  CONSTRAINT `FK_ticket_activity_logs_tickets` FOREIGN KEY (`tickets_id`) REFERENCES `tickets` (`reference_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ticket_activity_logs_tickets_conversations` FOREIGN KEY (`ticket_conversation_id`) REFERENCES `tickets_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.ticket_activity_logs: ~3 rows (approximately)
INSERT INTO `ticket_activity_logs` (`id`, `tickets_id`, `ticket_conversation_id`, `user_name`, `categories_id_old`, `categories_id_new`, `products_id_old`, `products_id_new`, `issues_id_old`, `issues_id_new`, `item_name_old`, `item_name_new`, `serial_number_old`, `serial_number_new`, `location_old`, `location_new`, `created_at`) VALUES
	(9, 'TK-67462', 481, 'RD Abuan', 7, 7, 26, 12, 68, 55, NULL, NULL, NULL, NULL, '409b', '409b', '2026-03-12 01:39:16'),
	(10, 'TK-33492', 482, 'RD Abuan', 7, 7, 30, 12, 56, 55, NULL, NULL, NULL, NULL, 'Room 302', 'Room 302', '2026-03-12 02:10:46'),
	(11, 'TK-98190', 484, 'RD Abuan', 7, 7, 12, 12, 34, 34, NULL, NULL, NULL, NULL, '205 B', '205 B', '2026-03-12 07:07:50');

-- Dumping structure for table ticketing-system.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` longtext,
  `contact_number` longtext,
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.users: ~8 rows (approximately)
INSERT INTO `users` (`id`, `pid`, `first_name`, `last_name`, `email`, `password`, `contact_number`, `is_deleted`, `created_at`, `updated_at`) VALUES
	(2, 'ab2dfbe9-d7fe-458b-be38-2f571fac190e', 'BeeSeeGlobal', 'SysAdmin', 'sysadmin@beesee.ph', '$2a$10$K/hCSFDOleNcEn5bPu2OJuESkXjD.b/U0iyujDD0c1fwLlCNKCJgC', '09231111111', 0, '2025-11-19 01:43:58', '2026-02-25 07:39:04'),
	(18, 'ebeabc0b-b84a-4bea-8a08-cf91e3b78882', 'RD', 'Abuan', 'rogildo.abuan@beesee.ph', '$2a$12$J/6lRwN6xLTD.KS4ef4jlOE0vLOlW97OTNBWwRvBumYNTN5mgCGBu', NULL, 0, '2025-11-27 02:35:55', '2026-02-23 03:55:21'),
	(21, 'c3907889-8f5c-4f8d-992f-3aa062931f34', 'Dexter', 'Jamero', 'dexterjamero@beesee.ph', '$2a$12$cJkKvfE.cPK4Tn/feUMbhOOk/qfyRWsdFjLAFpIJtkbYoipDAGIjO', '09934746723', 0, '2026-01-12 02:31:06', '2026-03-18 02:08:17'),
	(24, '28d16164-4824-424c-aec7-4d71ad75a7ff', 'Test', 'Test', 'test@gmail.com', '$2a$12$YSWTI/NpOt.Hbxs5YQpD5eapyn38rarhzt8ZIlck174geLFmtxT0a', NULL, 0, '2026-01-21 10:32:25', NULL),
	(25, '26a62154-1e52-4a26-ac7b-cdc493efc1ca', 'Thinz', 'Calizar', 'thinz@beesee.ph', '$2a$10$t0rqcdA342.BqBKORqgZzen1/GE5dGdkrVImaQ8mlc9TBwq46J1Ai', NULL, 0, '2026-02-06 06:57:48', '2026-02-23 05:57:42'),
	(26, 'c3907112-8f5c-4e2d-992f-3aa062932r34', 'Elle', 'Guevarra', 'elizabeth.guevarra@beesee.ph', '$2a$12$11tfPOcjY76fLYo77vHyIuwGNGBMc366rmnmoeduIIF.qA3aIrDL6', NULL, 0, '2026-01-12 02:31:06', '2026-02-23 05:50:13'),
	(27, 'ab2dfbw9-d7ee-458b-be38-2f571fac190f', 'Bryan', 'Pogi', 'bryansurio@beesee.ph', '$2a$12$pozG5sXif.NQGRomkj.JHuZPVqvI36XgRHKH/oc35AX1v9yCdpvRC', NULL, 0, '2025-11-19 01:43:58', NULL),
	(28, '0a953722-e6ee-453c-a7f7-cb32d16c1da8', 'Joshua', 'Santos', 'joshuadelossantos@beesee.ph', '$2a$12$njeenPW0MpOH49XLl4PicegNySRp.JsWOIBQ40rNK4BR.gXbcl2qa', '09312222222', 0, '2026-02-25 07:30:44', '2026-03-01 08:47:50');

-- Dumping structure for table ticketing-system.users_details
CREATE TABLE IF NOT EXISTS `users_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `positions_id` int DEFAULT NULL,
  `employment_status` enum('Active','Resigned','Terminated','On-leave') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `url_permission` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_details_users` (`users_id`),
  KEY `FK_users_details_positions` (`positions_id`),
  CONSTRAINT `FK_users_details_positions` FOREIGN KEY (`positions_id`) REFERENCES `positions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_users_details_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.users_details: ~8 rows (approximately)
INSERT INTO `users_details` (`id`, `users_id`, `positions_id`, `employment_status`, `url_permission`, `created_at`, `updated_at`) VALUES
	(2, 2, 37, 'Active', 'technician_url', '2025-11-19 01:43:58', '2026-02-25 07:39:04'),
	(13, 18, 26, 'Active', 'technician_url', '2025-11-27 02:35:55', '2026-01-12 07:49:27'),
	(16, 21, 39, 'Active', 'technician_url', '2026-01-12 02:31:06', '2026-03-18 02:08:17'),
	(19, 24, 25, 'Active', 'technician_url', '2026-01-21 10:32:25', NULL),
	(20, 25, 37, 'Active', 'technician_url', '2026-02-06 06:57:48', '2026-02-23 05:57:42'),
	(21, 26, 36, 'Active', 'technician_url', '2025-11-27 02:35:55', '2026-02-23 05:50:13'),
	(22, 27, 36, 'Active', 'technician_url', '2026-01-21 10:32:25', NULL),
	(23, 28, 36, 'Active', 'technician_url', '2026-02-25 07:30:44', NULL);

-- Dumping structure for table ticketing-system.users_images
CREATE TABLE IF NOT EXISTS `users_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `image_url` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_At` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_images_users` (`users_id`),
  CONSTRAINT `FK_users_images_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ticketing-system.users_images: ~8 rows (approximately)
INSERT INTO `users_images` (`id`, `users_id`, `image_url`, `created_at`, `updated_At`) VALUES
	(2, 2, 'https://rgfs.bryansurio.workers.dev/users/4e724aed-45a0-4c07-960a-8df6dc44f58c.png', '2025-11-24 03:35:43', '2026-02-06 07:00:05'),
	(7, 18, 'https://rgfs.bryansurio.workers.dev/users/2d8cfdab-ad65-4a3d-b633-f1fcaac7a42a.jfif', '2025-11-27 02:35:56', '2026-02-23 03:55:22'),
	(10, 21, 'https://rgfs.bryansurio.workers.dev/users/cdbb2f60-f654-4f4c-b861-f797347bd228.jpg', '2026-01-12 02:31:07', '2026-02-23 01:58:51'),
	(13, 24, 'https://rgfs.bryansurio.workers.dev/users/dda29fd6-b812-4148-8058-4f2a582b3778.png', '2026-01-21 10:32:26', NULL),
	(14, 25, 'https://rgfs.bryansurio.workers.dev/users/8eb67a5a-c812-4184-a2bc-f4b77c329aa4.jpg', '2026-02-06 06:57:49', '2026-02-23 01:40:01'),
	(15, 26, 'https://rgfs.bryansurio.workers.dev/users/87145e6e-9de1-49d7-a7db-16afdff8fb3e.jpg', '2025-11-24 03:35:43', '2026-02-23 03:41:04'),
	(16, 27, 'https://rgfs.bryansurio.workers.dev/users/4e724aed-45a0-4c07-960a-8df6dc44f58c.png', '2025-11-24 03:35:43', NULL),
	(17, 28, 'https://rgfs.bryansurio.workers.dev/users/43c564da-654d-442b-80ec-772985cce3ba.jpg', '2026-02-25 07:30:45', '2026-03-01 08:47:51');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
