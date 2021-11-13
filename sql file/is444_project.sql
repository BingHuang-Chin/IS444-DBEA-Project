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
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
('Rejected');

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
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `transaction_history`
--

DROP TABLE IF EXISTS `transaction_history`;
CREATE TABLE IF NOT EXISTS `transaction_history` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`transaction_status` INT(10) NOT NULL DEFAULT 1,
	`amount` INT(10) NOT NULL,
	`source_account` VARCHAR(100) NOT NULL,
	`dest_account` VARCHAR(100) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT	CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
