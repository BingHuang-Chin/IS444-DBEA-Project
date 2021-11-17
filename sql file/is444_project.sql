-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 01, 2021 at 07:20 AM
-- Server version: 8.0.18
-- PHP Version: 7.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS fastcash;
CREATE DATABASE fastcash;
USE fastcash;

--
-- Table structure for table `fc_user`
--

DROP TABLE IF EXISTS `fc_user`;
CREATE TABLE IF NOT EXISTS `fc_user` (
 `user_id` VARCHAR(255) NOT NULL,
 `credits` INT(10) NOT NULL DEFAULT 0,
 `is_lender` TINYINT(1) NOT NULL DEFAULT FALSE,
 `level` INT(10) NOT NULL DEFAULT 1,
 `current_exp` INT(10) NOT NULL DEFAULT 0,
 `total_exp` INT(10) NOT NULL DEFAULT 3,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fc_user` (`user_id`, `credits`, `is_lender`, `created_at`) VALUES
('8922365237', '1000', '1', CURRENT_TIMESTAMP),
('4513795324', '1500', '1', CURRENT_TIMESTAMP), 
('9289678798 ', '2000', '1', CURRENT_TIMESTAMP), 
('5391353070', '1750', '1', CURRENT_TIMESTAMP), 
('7108406563', '50', '0', CURRENT_TIMESTAMP),
('6275293700', '20', '0', CURRENT_TIMESTAMP), 
('1484470453', '0', '0', CURRENT_TIMESTAMP),
('5434523489', '15', '0', CURRENT_TIMESTAMP), 
('9834732347', '30', '0', CURRENT_TIMESTAMP),
('7483948763', '100', '0', CURRENT_TIMESTAMP);
                                                                             

--
-- Table structure for table `loan_status`
--

DROP TABLE IF EXISTS `loan_status`;
CREATE TABLE IF NOT EXISTS `loan_status` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `loan_status`
--

INSERT INTO loan_status (title)
VALUES
('Open'),
('Offered'),
('Rejected'),
('Repaid');

--
-- Table structure for table `transaction_status`
--

DROP TABLE IF EXISTS `transaction_status`;
CREATE TABLE IF NOT EXISTS `transaction_status` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction_status`
--

INSERT INTO transaction_status (title)
VALUES
('Pending'),
('Success'),
('Failed');


--
-- Table structure for table `peer_listing`
--

DROP TABLE IF EXISTS `peer_listing`;
CREATE TABLE IF NOT EXISTS `peer_listing` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`commited_amount` INT(10) NOT NULL,
	`interest_rate` INT(10) NOT NULL,
	`listed_by` VARCHAR(255) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT	CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`listed_by`) REFERENCES fc_user(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `peer_listing` (`commited_amount`, `interest_rate`, `listed_by`)
VALUES
(350, 15, '8922365237');

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
CREATE TABLE IF NOT EXISTS `loans` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(255) NOT NULL,
	`loan_amount` DECIMAL NOT NULL,
	`loan_status` INT(10) NOT NULL DEFAULT 1,
	`loaned_by` VARCHAR(255) NOT NULL,
	`payment_duration` INT(10) NOT NULL,
	`due_date` TIMESTAMP NOT NULL,
	`interest` INT(10) DEFAULT 15,
	`peer_listing_id` INT(10) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (loan_status) REFERENCES loan_status(id) ON DELETE CASCADE,
	FOREIGN KEY (peer_listing_id) REFERENCES peer_listing(id) ON DELETE CASCADE,
	FOREIGN KEY (loaned_by) REFERENCES fc_user(user_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES fc_user(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `loans` (`user_id`, `loan_amount`, `loan_status`, `loaned_by`, `payment_duration`, `due_date`, `interest`, `peer_listing_id`) VALUES 
('7108406563', '250', '1', '8922365237', '1', '2021-12-13 00:00:00', '5', 1),
('6275293700', '500', '1', '4513795324', '2', '2022-01-13 00:00:00', '10', 1), 
('5434523489', '300', '1', '4513795324', '4', '2022-03-13 00:00:00', '16', 1),
('7483948763', '250', '2', '4513795324', '1', '2021-12-13 00:00:00', '4', 1), 
('1484470453', '1000', '2', '5391353070', '1', '2021-11-13 00:00:00', '6', 1);


--
-- Table structure for table `transaction_history`
--

DROP TABLE IF EXISTS `transaction_history`;
CREATE TABLE IF NOT EXISTS `transaction_history` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(255) NOT NULL,
	`transaction_status` INT(10) NOT NULL DEFAULT 1,
	`amount` INT(10) NOT NULL,
	`source_account` VARCHAR(100) NOT NULL,
	`dest_account` VARCHAR(100) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT	CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	FOREIGN KEY (transaction_status) REFERENCES transaction_status(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
