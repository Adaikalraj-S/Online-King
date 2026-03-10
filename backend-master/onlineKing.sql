-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2024 at 03:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onlineKing`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `accessToken` varchar(5000) DEFAULT NULL,
  `refreshToken` varchar(5000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `fullname`, `email`, `password`, `accessToken`, `refreshToken`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Admin', 'admin@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbG5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwMTgyMDE5LCJleHAiOjE3MjAxOTY0MTl9.VeAuQtJaV3vjDIECBD1OgsNkgRk9JqHUm5rIz0gvUaA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbG5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwMTgyMDE5LCJleHAiOjE3NTE3Mzk2MTl9.AYhKm5w5c3AEIE5f3xJhm-uzqPayo7589gREEcXZh3I', '2023-08-26 00:00:00', '2024-07-05 12:20:19', NULL),
(4, 'Admin2', 'admin2@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZnVsbG5hbWUiOiJBZG1pbjIiLCJlbWFpbCI6ImFkbWluMkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJhcHBsaWNhdGlvbiI6ImNsb3NlMmJ1eSIsImlhdCI6MTcwMzkzNDgxOCwiZXhwIjoxNzAzOTQ5MjE4fQ.gXqHQyBVA4uu2yB94eqC0ZL-YtUyN3ksZxJh8fVrLg0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZnVsbG5hbWUiOiJBZG1pbjIiLCJlbWFpbCI6ImFkbWluMkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJhcHBsaWNhdGlvbiI6ImNsb3NlMmJ1eSIsImlhdCI6MTcwMzkzNDgxOCwiZXhwIjoxNzM1NDkyNDE4fQ._CRZD4fwx4g0Sduz9YQrq64UphnMKG60x_JM3Y9Sbn8', '2023-08-26 00:00:00', '2023-12-30 11:13:38', NULL),
(5, 'Admin3', 'admin3@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZnVsbG5hbWUiOiJBZG1pbjMiLCJlbWFpbCI6ImFkbWluM0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJhcHBsaWNhdGlvbiI6ImNsb3NlMmJ1eSIsImlhdCI6MTcwNDIwNTcyNiwiZXhwIjoxNzA0MjIwMTI2fQ.ijbR-mgV1Klm39j4e8QEke-zC4zouCoiohswIrWuHP8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZnVsbG5hbWUiOiJBZG1pbjMiLCJlbWFpbCI6ImFkbWluM0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJhcHBsaWNhdGlvbiI6ImNsb3NlMmJ1eSIsImlhdCI6MTcwNDIwNTcyNiwiZXhwIjoxNzM1NzYzMzI2fQ.fdkYEI1QEdPqXXYAMn_tEyf3dT59ZNDMCHFBNcUfFLI', '2023-08-26 00:00:00', '2024-01-02 14:28:46', NULL),
(6, 'subham', 'admin10@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZnVsbG5hbWUiOiJzdWJoYW0iLCJlbWFpbCI6ImFkbWluMTBAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzA0MzY3OTY2LCJleHAiOjE3MDQzODIzNjZ9.ZPvJoj_NalRu4VP7xXToHeQMIWaJznlQ4-2HNqh-UdM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZnVsbG5hbWUiOiJzdWJoYW0iLCJlbWFpbCI6ImFkbWluMTBAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzA0MzY3OTY2LCJleHAiOjE3MzU5MjU1NjZ9.2bOp3uciGdY9Q2aZ39gafp6noBOHGzj5JiKeXUxOCnQ', '2024-01-03 09:38:50', '2024-01-04 11:32:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `attributes_combinations`
--

CREATE TABLE `attributes_combinations` (
  `id` int(11) NOT NULL,
  `combination_id` int(11) DEFAULT NULL,
  `attribute_id` int(11) DEFAULT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes_combinations`
--

INSERT INTO `attributes_combinations` (`id`, `combination_id`, `attribute_id`, `attribute_value`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '128gb', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(2, 2, 1, '256gb', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(3, 3, 1, '556gb', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(4, 4, 1, '1tb', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(5, 5, 1, '128gb', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(6, 5, 2, 'Red', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(7, 6, 1, '128gb', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(8, 6, 2, 'Titanium', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(9, 7, 1, '1tb', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(10, 7, 2, 'Red', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(11, 8, 1, '1tb', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(12, 8, 2, 'Titanium', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(13, 9, 1, '128', '2024-07-05 05:34:50', '2024-07-05 05:34:50', NULL),
(14, 10, 2, 'red', '2024-07-05 05:43:45', '2024-07-05 05:43:45', NULL),
(15, 11, 1, '128', '2024-07-05 05:47:49', '2024-07-05 05:47:49', NULL),
(16, 12, 1, '256', '2024-07-05 05:58:31', '2024-07-05 05:58:31', NULL),
(17, 13, 2, 'red', '2024-07-05 06:32:20', '2024-07-05 06:32:20', NULL),
(18, 14, 2, 'green', '2024-07-05 06:40:32', '2024-07-05 06:40:32', NULL),
(19, 15, 2, 'red', '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(20, 15, 1, '8GB', '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(21, 16, 2, 'green', '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(22, 16, 1, '8GB', '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(23, 17, 2, 'black', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(24, 17, 1, '8GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(25, 18, 2, 'black', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(26, 18, 1, '4GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(27, 19, 2, 'black', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(28, 19, 1, '12GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(29, 20, 2, 'red', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(30, 20, 1, '8GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(31, 21, 2, 'red', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(32, 21, 1, '4GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(33, 22, 2, 'red', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(34, 22, 1, '12GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(35, 23, 2, 'green', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(36, 23, 1, '8GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(37, 24, 2, 'green', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(38, 24, 1, '4GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(39, 25, 2, 'green', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(40, 25, 1, '12GB', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `banner_name` varchar(255) DEFAULT NULL,
  `banner_type` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `super_sub_category_id` int(11) DEFAULT NULL,
  `web_image_url` varchar(255) DEFAULT NULL,
  `app_image_url` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `banner_name`, `banner_type`, `category_id`, `sub_category_id`, `super_sub_category_id`, `web_image_url`, `app_image_url`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Welcome 50', 'product', NULL, NULL, NULL, '/uploads/banners/1712858244164.jpg', '/uploads/banners/1712858244166.jpg', 0, '2024-04-11 17:57:24', '2024-06-27 07:46:53', '2024-06-27 07:46:53'),
(2, 'Welcome 5045', 'category', 3, 4, 3, '/uploads/banners/1712858262041.jpg', '/uploads/banners/1712858262042.jpg', 0, '2024-04-11 17:57:42', '2024-06-27 07:46:51', '2024-06-27 07:46:51'),
(3, 'Camera', 'category', 2, NULL, NULL, '/uploads/banners/1716725500134.jpeg', '/uploads/banners/1716725500135.png', 1, '2024-05-26 12:11:40', '2024-06-26 13:26:37', NULL),
(4, 'Motherboard', 'product', NULL, NULL, NULL, '/uploads/banners/1716786054960.png', '/uploads/banners/1716786054963.png', 1, '2024-05-27 05:00:54', '2024-06-27 07:50:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banner_product_associations`
--

CREATE TABLE `banner_product_associations` (
  `id` int(11) NOT NULL,
  `banner_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner_product_associations`
--

INSERT INTO `banner_product_associations` (`id`, `banner_id`, `product_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '2024-04-11 17:57:24', '2024-04-11 17:57:24', NULL),
(2, 1, 2, '2024-04-11 17:57:24', '2024-04-11 17:57:24', NULL),
(3, 4, 11, '2024-05-27 05:00:54', '2024-05-27 05:00:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `combination_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `dealer_id`, `product_id`, `combination_id`, `quantity`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 26, NULL, 37, 18, 6, '2024-07-05 10:25:03', '2024-07-05 10:25:03', '2024-07-05 10:29:19'),
(2, 26, NULL, 37, 18, 1, '2024-07-05 10:30:28', '2024-07-05 10:30:28', '2024-07-05 10:30:31'),
(3, 26, NULL, 37, 18, 1, '2024-07-05 10:31:10', '2024-07-05 10:31:10', '2024-07-05 10:31:12'),
(4, 26, NULL, 37, 18, 1, '2024-07-05 10:32:23', '2024-07-05 10:32:23', '2024-07-05 10:32:26'),
(5, 26, NULL, 37, 18, 1, '2024-07-05 10:32:43', '2024-07-05 10:32:43', '2024-07-05 10:32:45'),
(6, 26, NULL, 37, 18, 2, '2024-07-05 10:33:41', '2024-07-05 11:50:51', '2024-07-05 11:50:55'),
(7, 26, NULL, 16, 1, 15, '2024-07-05 11:51:12', '2024-07-05 12:10:18', '2024-07-05 12:10:38'),
(8, 26, NULL, 16, 1, 1, '2024-07-05 12:10:42', '2024-07-08 06:15:22', '2024-07-08 06:15:23'),
(9, 26, NULL, 37, 18, 4, '2024-07-05 12:17:05', '2024-07-05 12:17:05', '2024-07-05 12:44:00'),
(10, 24, NULL, 36, NULL, 1, '2024-07-05 12:44:44', '2024-07-05 12:44:44', '2024-07-08 09:34:22'),
(11, 26, NULL, 34, 13, 1, '2024-07-05 12:59:33', '2024-07-05 13:00:17', '2024-07-08 11:46:42'),
(12, 26, NULL, 16, 1, 3, '2024-07-08 06:39:45', '2024-07-08 06:59:56', '2024-07-08 09:59:30'),
(13, 26, NULL, 16, 4, 4, '2024-07-08 06:43:15', '2024-07-08 06:43:21', '2024-07-08 06:43:59'),
(14, 26, NULL, 16, 3, 1, '2024-07-08 09:59:12', '2024-07-08 09:59:12', '2024-07-08 09:59:28'),
(15, 24, NULL, 37, 18, 2, '2024-07-08 10:07:50', '2024-07-08 10:08:02', '2024-07-08 10:13:37'),
(16, 24, NULL, 22, NULL, 1, '2024-07-08 10:12:33', '2024-07-08 10:12:33', '2024-07-08 10:13:37'),
(17, 24, NULL, 20, NULL, 1, '2024-07-08 10:12:37', '2024-07-08 10:12:37', '2024-07-08 10:13:36'),
(18, 24, NULL, 34, NULL, 1, '2024-07-08 10:13:12', '2024-07-08 10:13:12', '2024-07-08 10:13:37'),
(19, 24, NULL, 23, NULL, 1, '2024-07-08 10:13:14', '2024-07-08 10:13:14', '2024-07-08 10:13:37'),
(20, 24, NULL, 36, NULL, 1, '2024-07-08 10:14:31', '2024-07-08 10:14:31', '2024-07-08 10:42:09'),
(21, 24, NULL, 34, NULL, 1, '2024-07-08 10:14:33', '2024-07-08 10:14:33', '2024-07-08 10:42:08'),
(22, 24, NULL, 23, NULL, 1, '2024-07-08 10:16:11', '2024-07-08 10:16:11', '2024-07-08 10:42:07'),
(23, 24, NULL, 22, NULL, 1, '2024-07-08 10:16:14', '2024-07-08 10:16:14', '2024-07-08 10:42:07'),
(24, 24, NULL, 36, 16, 5, '2024-07-08 10:41:36', '2024-07-08 10:41:36', '2024-07-08 10:42:10'),
(25, 24, NULL, 20, 10, 1, '2024-07-08 11:44:27', '2024-07-08 11:44:27', NULL),
(26, 26, NULL, 36, NULL, 1, '2024-07-08 11:44:55', '2024-07-08 11:44:55', '2024-07-08 11:46:41'),
(27, 26, NULL, 37, NULL, 1, '2024-07-08 11:45:02', '2024-07-08 11:45:02', '2024-07-08 11:46:40'),
(28, 26, NULL, 37, 19, 1, '2024-07-08 11:46:26', '2024-07-08 11:46:26', '2024-07-08 11:46:40'),
(29, 26, NULL, 37, 18, 1, '2024-07-08 11:46:29', '2024-07-08 11:46:29', '2024-07-08 11:46:43'),
(30, 24, NULL, 18, NULL, 1, '2024-07-08 11:47:18', '2024-07-08 11:47:18', NULL),
(31, 26, NULL, 22, NULL, 1, '2024-07-08 11:47:25', '2024-07-08 11:47:25', '2024-07-08 12:54:19'),
(32, 26, NULL, 18, NULL, 1, '2024-07-08 11:48:20', '2024-07-08 11:48:20', '2024-07-08 12:54:17'),
(33, 26, NULL, 37, 19, 1, '2024-07-08 11:49:34', '2024-07-08 11:49:34', '2024-07-08 12:54:20'),
(34, 24, NULL, 21, 11, 1, '2024-07-08 12:00:53', '2024-07-08 12:00:53', NULL),
(35, 26, NULL, 23, 12, 1, '2024-07-08 12:35:53', '2024-07-08 12:35:53', '2024-07-08 12:54:19'),
(36, 26, NULL, 34, 13, 1, '2024-07-08 12:35:54', '2024-07-08 12:35:54', '2024-07-08 12:54:20'),
(37, 26, NULL, 21, 11, 1, '2024-07-08 12:43:04', '2024-07-08 12:43:04', '2024-07-08 12:54:18'),
(38, 26, NULL, 20, NULL, 1, '2024-07-08 12:49:21', '2024-07-08 12:49:21', '2024-07-08 12:54:18'),
(39, 26, NULL, 23, 12, 1, '2024-07-08 12:54:31', '2024-07-08 12:54:31', '2024-07-08 13:08:42'),
(40, 26, NULL, 22, NULL, 1, '2024-07-08 12:54:34', '2024-07-08 12:54:34', '2024-07-08 13:08:41'),
(41, 26, NULL, 22, NULL, 1, '2024-07-08 13:08:47', '2024-07-08 13:08:47', '2024-07-08 13:23:20'),
(42, 26, NULL, 20, 10, 1, '2024-07-08 13:08:50', '2024-07-08 13:08:50', '2024-07-08 13:23:19'),
(43, 26, NULL, 23, 12, 1, '2024-07-08 13:14:36', '2024-07-08 13:14:36', '2024-07-08 13:23:20'),
(44, 26, NULL, 34, 13, 1, '2024-07-08 13:14:40', '2024-07-08 13:14:40', '2024-07-08 13:23:20'),
(45, 24, NULL, 35, 14, 1, '2024-07-08 13:19:52', '2024-07-08 13:19:52', NULL),
(46, 26, NULL, 23, 12, 1, '2024-07-08 13:23:44', '2024-07-08 13:28:33', '2024-07-08 13:29:16');

-- --------------------------------------------------------

--
-- Table structure for table `car_brands`
--

CREATE TABLE `car_brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(99) NOT NULL,
  `image_url` varchar(99) NOT NULL,
  `status` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_brands`
--

INSERT INTO `car_brands` (`id`, `brand_name`, `image_url`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'BMW', '/uploads/carbrands/1711447617426.png', 1, '2024-04-01 18:06:11', '2024-04-01 18:06:11', NULL),
(2, 'AUDI', '/uploads/carbrands/1711447627850.png', 1, '2024-04-01 18:06:10', '2024-04-01 18:06:10', NULL),
(3, 'adasd', '/uploads/carbrands/1711994091636.png', 1, '2024-04-01 18:06:09', '2024-04-01 18:06:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_lists`
--

CREATE TABLE `car_lists` (
  `id` int(11) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `car_models`
--

CREATE TABLE `car_models` (
  `id` int(11) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `model_name` varchar(99) NOT NULL,
  `start_year` varchar(99) NOT NULL,
  `end_year` varchar(99) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `image_url` varchar(99) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_models`
--

INSERT INTO `car_models` (`id`, `brand_id`, `model_name`, `start_year`, `end_year`, `status`, `image_url`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 2, 'AQ', '2001', '2005', 1, '/uploads/carbrands/1711447643012.png', '2024-04-01 18:06:38', '2024-04-01 18:06:38', NULL),
(2, 1, 'X6', '2004', '2005', 1, '/uploads/carbrands/1711447655610.png', '2024-04-01 18:06:40', '2024-04-01 18:06:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(99) NOT NULL,
  `image_url` varchar(99) NOT NULL,
  `banner_id` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `image_url`, `banner_id`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'EXTERIOR', '/uploads/categories/1711447197363.jpg', NULL, 1, '2024-03-26 09:59:57', '2024-07-05 09:05:46', '2024-07-05 09:05:46'),
(2, 'INTERIOR', '/uploads/categories/1711447205745.jpg', NULL, 1, '2024-03-26 10:00:05', '2024-05-26 12:27:55', '2024-05-26 12:27:55'),
(3, 'Mobile', '/uploads/categories/1716726503758.webp', NULL, 1, '2024-03-26 10:00:14', '2024-05-26 12:28:23', NULL),
(4, 'asda', '/uploads/categories/default.png', NULL, 1, '2024-03-30 04:42:42', '2024-03-30 04:43:09', '2024-03-30 04:43:09'),
(5, 'asdasd', '/uploads/categories/1711773808738.png', NULL, 1, '2024-03-30 04:43:20', '2024-05-26 12:27:50', '2024-05-26 12:27:50'),
(6, 'Alloy Wheels', '/uploads/categories/1712053061050.png', NULL, 0, '2024-04-02 10:17:30', '2024-04-02 10:17:47', '2024-04-02 10:17:47'),
(7, 'Processor', '/uploads/categories/1716726459182.png', NULL, 1, '2024-05-26 12:27:39', '2024-05-26 12:27:39', NULL),
(8, 'Headphone', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:58:12', '2024-05-27 06:58:12', NULL),
(9, 'Power Supply', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:58:44', '2024-05-27 06:58:44', NULL),
(10, 'MotherBoard', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:58:51', '2024-07-01 13:21:36', NULL),
(11, 'Graphics Card', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:59:01', '2024-05-27 06:59:01', NULL),
(12, 'Memory Ram', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:59:10', '2024-05-27 06:59:10', NULL),
(13, 'Storage Devices', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:59:18', '2024-05-27 06:59:18', NULL),
(14, 'Software', '/uploads/default/default.png', NULL, 1, '2024-05-27 06:59:37', '2024-05-27 06:59:37', NULL),
(15, 'asdasd', '/uploads/categories/1719296644521.png', NULL, 1, '2024-06-25 06:24:04', '2024-07-05 09:01:29', '2024-07-05 09:01:29'),
(16, 'tetetetet', '/uploads/categories/1719989525372.png', NULL, 1, '2024-07-03 06:52:05', '2024-07-03 07:46:36', '2024-07-03 07:46:36'),
(17, 'Cabinet', '/uploads/default/default.png', NULL, 1, '2024-07-05 09:01:51', '2024-07-05 09:01:51', NULL),
(18, 'Computer Accessories', '/uploads/default/default.png', NULL, 1, '2024-07-05 09:05:56', '2024-07-05 09:05:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `coupon_type` varchar(255) DEFAULT NULL,
  `coupon_title` varchar(255) DEFAULT NULL,
  `coupon_name` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `max_use_per_user` int(11) DEFAULT NULL,
  `max_use` int(11) DEFAULT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `min_order_amount` double DEFAULT NULL,
  `max_discount` double DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `coupon_type`, `coupon_title`, `coupon_name`, `status`, `max_use_per_user`, `max_use`, `discount_type`, `discount`, `min_order_amount`, `max_discount`, `user_id`, `dealer_id`, `start_date`, `expiry_date`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Dealer Wise', 'Welcome dealer', 'DEALER10', 1, 1, NULL, 'Percent', 10, 499, 80, NULL, 1, '2024-03-28 00:00:00', '2024-04-03 00:00:00', '2024-03-28 06:53:43', '2024-03-28 06:53:43', NULL),
(2, 'First Order', 'Welcome', 'WELCOME20', 1, 1, NULL, 'Percent', 10, 400, 90, NULL, NULL, NULL, NULL, '2024-03-28 08:13:28', '2024-03-28 08:13:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `accessToken` varchar(5000) DEFAULT NULL,
  `refreshToken` varchar(5000) DEFAULT NULL,
  `device_token` varchar(2000) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `fullname`, `dob`, `language`, `username`, `email`, `phone`, `password`, `verified`, `accessToken`, `refreshToken`, `device_token`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 'Subham', NULL, NULL, 'jenasubham715@gmail.com', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-03-28 05:33:55', '2024-03-28 05:33:55', '2024-03-28 05:36:37'),
(3, 'Subham', NULL, NULL, 'jenasubham715@gmail.com', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-03-28 05:36:37', '2024-03-28 05:36:37', '2024-03-28 05:37:14'),
(4, 'Subham', NULL, NULL, 'jenasubham715@gmail.com', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-03-28 05:37:14', '2024-03-28 05:37:14', '2024-03-28 05:38:16'),
(5, 'Subham', NULL, NULL, 'jenasubham715@gmail.com', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-03-28 05:38:16', '2024-03-28 05:38:16', NULL),
(6, 'Subham', NULL, NULL, 'subhamjena0001@gmail.com', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZnVsbG5hbWUiOiJTdWJoYW0iLCJ1c2VybmFtZSI6InN1YmhhbWplbmEwMDAxQGdtYWlsLmNvbSIsInJvbGUiOiJDVVNUT01FUiIsImFwcGxpY2F0aW9uIjoia2FyZGlmeSIsImlhdCI6MTcxMTYwNDYwNiwiZXhwIjoxNzExNjE5MDA2fQ.RHl7EUd3HM37KwMzwCx9piDmXMXWQzepXvx-K5fXvHc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZnVsbG5hbWUiOiJTdWJoYW0iLCJ1c2VybmFtZSI6InN1YmhhbWplbmEwMDAxQGdtYWlsLmNvbSIsInJvbGUiOiJDVVNUT01FUiIsImFwcGxpY2F0aW9uIjoia2FyZGlmeSIsImlhdCI6MTcxMTYwNDYwNiwiZXhwIjoxNzQzMTYyMjA2fQ.Ub5XhxS-Ki2orK-Zwck6Y9tEr45W3uhcoOalWtVCHt4', NULL, '2024-03-28 05:42:57', '2024-03-28 05:43:26', NULL),
(7, 'Subham', NULL, NULL, 'subhamdaddu007@gmail.com', 'subhamdaddu007@gmail.com', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, NULL, NULL, NULL, '2024-03-28 06:00:47', '2024-03-28 06:01:09', NULL),
(8, 'shijo', NULL, NULL, 'shijo@gmail.com', 'shijo@gmail.com', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-29 09:49:33', '2024-05-29 09:49:33', NULL),
(9, 'shijo', NULL, NULL, 'shijothomashome@gmail.com', 'shijothomashome@gmail.com', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, NULL, NULL, NULL, '2024-05-29 09:50:24', '2024-05-29 09:51:18', NULL),
(10, 'pankaj', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:15:34', '2024-05-31 06:15:34', '2024-05-31 06:15:56'),
(11, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:15:56', '2024-05-31 06:15:56', '2024-05-31 06:20:10'),
(12, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:20:10', '2024-05-31 06:20:10', '2024-05-31 06:23:01'),
(13, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:23:01', '2024-05-31 06:23:01', '2024-05-31 06:26:33'),
(14, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:26:33', '2024-05-31 06:26:33', '2024-05-31 06:31:00'),
(15, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:31:00', '2024-05-31 06:31:00', '2024-05-31 06:31:53'),
(16, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:31:53', '2024-05-31 06:31:53', '2024-05-31 06:34:20'),
(17, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:34:20', '2024-05-31 06:34:20', '2024-05-31 06:36:07'),
(18, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:36:07', '2024-05-31 06:36:07', '2024-05-31 06:39:22'),
(19, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:39:22', '2024-05-31 06:39:22', '2024-05-31 06:48:10'),
(20, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:48:10', '2024-05-31 06:48:10', '2024-05-31 06:54:31'),
(21, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:54:31', '2024-05-31 06:54:31', '2024-05-31 06:56:11'),
(22, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 06:56:11', '2024-05-31 06:56:11', '2024-05-31 07:07:38'),
(23, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 0, NULL, NULL, NULL, '2024-05-31 07:07:38', '2024-05-31 07:07:38', '2024-05-31 07:13:27'),
(24, 'pankaj roy', NULL, NULL, '918618691367', '918618691367', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImZ1bGxuYW1lIjoicGFua2FqIHJveSIsInVzZXJuYW1lIjoiOTE4NjE4NjkxMzY3Iiwicm9sZSI6IkNVU1RPTUVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwNDMxMjQ5LCJleHAiOjE3MjA0NDU2NDl9.DKIjULGdJ842vwdFezIhY2nk7GoiWxIGdBLxRk_im-4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImZ1bGxuYW1lIjoicGFua2FqIHJveSIsInVzZXJuYW1lIjoiOTE4NjE4NjkxMzY3Iiwicm9sZSI6IkNVU1RPTUVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwNDMxMjQ5LCJleHAiOjE3NTE5ODg4NDl9.Eqs1NQoQJWYRNvbD10rFyA2JkBw2Lyk6C5aje8dW-iI', NULL, '2024-05-31 07:13:27', '2024-07-08 09:34:09', NULL),
(25, 'Akash', NULL, NULL, 'xexebin803@hutov.com', 'xexebin803@hutov.com', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, NULL, NULL, NULL, '2024-05-31 13:18:19', '2024-05-31 13:19:05', NULL),
(26, 'Subham', NULL, NULL, 'subham.kj@jurysoft.com', 'subham.kj@jurysoft.com', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImZ1bGxuYW1lIjoiU3ViaGFtIiwidXNlcm5hbWUiOiJzdWJoYW0ua2pAanVyeXNvZnQuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwNDMyMjc0LCJleHAiOjE3MjA0NDY2NzR9.o2Syd6WhC1TC4_VMEbxB6dusdkVEQlnZOy6W0-M3oO0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImZ1bGxuYW1lIjoiU3ViaGFtIiwidXNlcm5hbWUiOiJzdWJoYW0ua2pAanVyeXNvZnQuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzIwNDMyMjc0LCJleHAiOjE3NTE5ODk4NzR9.W1tedXl3P8qk7ihAq7xM1-VIyqKwLx0XCDfn5d_udv4', NULL, '2024-06-25 11:37:40', '2024-07-08 09:51:14', NULL),
(27, 'subham', NULL, NULL, '918249229465', '918249229465', NULL, '81dc9bdb52d04dc20036dbd8313ed055', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImZ1bGxuYW1lIjoic3ViaGFtIiwidXNlcm5hbWUiOiI5MTgyNDkyMjk0NjUiLCJyb2xlIjoiQ1VTVE9NRVIiLCJhcHBsaWNhdGlvbiI6ImthcmRpZnkiLCJpYXQiOjE3MjAwMTAxMzgsImV4cCI6MTcyMDAyNDUzOH0.tryGC1tR2VnfxDi_kKc2Y7CnQ7snxMMeZ-V8cKxRdk0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImZ1bGxuYW1lIjoic3ViaGFtIiwidXNlcm5hbWUiOiI5MTgyNDkyMjk0NjUiLCJyb2xlIjoiQ1VTVE9NRVIiLCJhcHBsaWNhdGlvbiI6ImthcmRpZnkiLCJpYXQiOjE3MjAwMTAxMzgsImV4cCI6MTc1MTU2NzczOH0.2gdTKrDhZWdPt-4AWIROzwgUll9lGjR6DXXxgoyjFr0', NULL, '2024-07-03 12:35:01', '2024-07-03 12:35:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dealers`
--

CREATE TABLE `dealers` (
  `id` int(11) NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `approved` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `fullname` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `language` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `personal_email` varchar(255) DEFAULT NULL,
  `personal_mobile` varchar(255) DEFAULT NULL,
  `personal_alt_mobile` varchar(255) DEFAULT NULL,
  `add1` varchar(255) DEFAULT NULL,
  `add2` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `rejected_reason` varchar(255) DEFAULT NULL,
  `identity_proof_name` varchar(255) DEFAULT NULL,
  `identity_proof_file_url` varchar(255) DEFAULT NULL,
  `accessToken` varchar(2000) DEFAULT NULL,
  `refreshToken` varchar(2000) DEFAULT NULL,
  `device_token` varchar(2000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dealers`
--

INSERT INTO `dealers` (`id`, `verified`, `approved`, `is_active`, `fullname`, `first_name`, `last_name`, `dob`, `gender`, `password`, `language`, `username`, `personal_email`, `personal_mobile`, `personal_alt_mobile`, `add1`, `add2`, `area`, `city`, `state`, `country`, `pincode`, `landmark`, `lat`, `lng`, `rejected_reason`, `identity_proof_name`, `identity_proof_file_url`, `accessToken`, `refreshToken`, `device_token`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, 1, 'Subham', 'Subham', 'Jena', NULL, NULL, '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'subham.kj@jurysoft.com', 'subham.kj@jurysoft.com', '8249229465', NULL, 'Jurysoft', 'Jurysoft', 'Rr nagar', 'Bengaluru', 'Karnataka', 'India', '560098', 'Rr nagar', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbG5hbWUiOiJTdWJoYW0iLCJ1c2VybmFtZSI6InN1YmhhbS5rakBqdXJ5c29mdC5jb20iLCJyb2xlIjoiREVBTEVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzExNjA4NTM1LCJleHAiOjE3MTE2MjI5MzV9._oGtNxPACUtG4VACEDtWpE-Gd_H_jsDqx8isNxJQONE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbG5hbWUiOiJTdWJoYW0iLCJ1c2VybmFtZSI6InN1YmhhbS5rakBqdXJ5c29mdC5jb20iLCJyb2xlIjoiREVBTEVSIiwiYXBwbGljYXRpb24iOiJrYXJkaWZ5IiwiaWF0IjoxNzExNjA4NTM1LCJleHAiOjE3NDMxNjYxMzV9.vAcmYT6N_lvWyPuX8Ty03R4mSiVNYs9z3W1vZyYJfOY', NULL, '2024-03-28 06:40:48', '2024-03-28 06:48:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `delivery_types`
--

CREATE TABLE `delivery_types` (
  `id` int(11) NOT NULL,
  `delivery_type_name` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_types`
--

INSERT INTO `delivery_types` (`id`, `delivery_type_name`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'self pickup', NULL, '2024-01-25 06:11:57', '2024-01-25 06:11:57', NULL),
(2, 'online', NULL, '2024-01-25 06:13:10', '2024-01-25 06:13:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `id` int(11) NOT NULL,
  `discount_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `product_brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `super_sub_category_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `min_amount` double DEFAULT NULL,
  `max_amount` double DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discounts`
--

INSERT INTO `discounts` (`id`, `discount_name`, `image`, `product_brand_id`, `category_id`, `sub_category_id`, `super_sub_category_id`, `product_id`, `discount_type`, `discount`, `min_amount`, `max_amount`, `start_date`, `expiry_date`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Test Offer', '/uploads/offers/1713420913397.jpg', NULL, NULL, NULL, NULL, NULL, 'amount', 122, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:15:13', '2024-04-18 06:44:14', '2024-04-18 06:44:14'),
(2, 'Wheel Offer', '/uploads/offers/1713420979178.png', NULL, NULL, NULL, NULL, NULL, 'amount', 212, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:16:19', '2024-04-18 06:44:11', '2024-04-18 06:44:11'),
(3, 'Wheel Offers', '/uploads/offers/1713421198377.jpg', NULL, NULL, NULL, NULL, NULL, 'amount', 122, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:19:58', '2024-04-18 06:44:09', '2024-04-18 06:44:09'),
(4, 'subham ej na', '/uploads/offers/1713422437538.jpg', NULL, 2, 2, NULL, NULL, 'amount', 133, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:40:37', '2024-04-18 06:44:08', '2024-04-18 06:44:08'),
(5, 'Test Offer', '/uploads/offers/1713422694870.jpg', NULL, 2, NULL, NULL, NULL, 'amount', 144, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:44:54', '2024-04-18 07:11:00', NULL),
(6, 'Test Offer12', '/uploads/offers/1713423307070.jpg', NULL, NULL, NULL, NULL, NULL, 'amount', 200, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 1, '2024-04-18 06:55:07', '2024-04-18 07:24:02', NULL),
(7, 'Test Offer subham', '/uploads/offers/1713424309599.jpg', 2, NULL, NULL, NULL, NULL, 'amount', 212, 0, 0, '2024-04-18 00:00:00', '2024-04-19 00:00:00', 0, '2024-04-18 07:11:49', '2024-04-18 07:23:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `installers`
--

CREATE TABLE `installers` (
  `id` int(11) NOT NULL,
  `installer_id` varchar(255) DEFAULT NULL,
  `installer_name` varchar(255) DEFAULT NULL,
  `installer_email` varchar(255) DEFAULT NULL,
  `installer_phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `add1` varchar(255) DEFAULT NULL,
  `add2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `offer_name` varchar(999) DEFAULT NULL,
  `offer_type` varchar(255) DEFAULT NULL,
  `product_brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `super_sub_category_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offers_product_associations`
--

CREATE TABLE `offers_product_associations` (
  `id` int(11) NOT NULL,
  `offer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `user_address_id` int(11) DEFAULT NULL,
  `delivery_type_id` int(11) DEFAULT NULL,
  `order_status_id` int(11) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT NULL,
  `order_accepted_date` timestamp NULL DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT NULL,
  `rejected_reason` varchar(255) DEFAULT NULL,
  `payment_via` varchar(999) DEFAULT NULL,
  `payment_ref_id` varchar(255) DEFAULT NULL,
  `shipping_link` varchar(255) DEFAULT NULL,
  `shipping_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `total_discount_amount` double DEFAULT NULL,
  `total_paid_amount` double DEFAULT NULL,
  `total_gst_amount` double DEFAULT NULL,
  `total_shipping_amount` double DEFAULT NULL,
  `total_product_amount` double DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `user_id`, `user_type`, `dealer_id`, `user_address_id`, `delivery_type_id`, `order_status_id`, `order_date`, `order_accepted_date`, `accepted`, `rejected_reason`, `payment_via`, `payment_ref_id`, `shipping_link`, `shipping_id`, `coupon_id`, `total_discount_amount`, `total_paid_amount`, `total_gst_amount`, `total_shipping_amount`, `total_product_amount`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'OD1234477383233001', NULL, 'DEALER', 1, 0, 1, 1, NULL, NULL, NULL, NULL, 'Razorpay', 'qdasda', NULL, NULL, 0, NULL, 123123, NULL, 0, 12312, '2024-03-28 07:37:20', '2024-03-28 07:37:20', NULL),
(2, 'OD1234477383233002', NULL, 'DEALER', 1, NULL, 2, 1, NULL, NULL, NULL, NULL, 'Phonepe', 'pay_NrhIGBEmqYygcG', NULL, NULL, NULL, NULL, 14469.84, NULL, 0, 11846.93, '2024-03-28 07:44:51', '2024-03-28 07:44:51', NULL),
(3, 'OD1234477383233003', NULL, 'DEALER', 1, NULL, 2, 1, NULL, NULL, NULL, NULL, 'Phonepe', 'pay_NrhkBIAiTLZ4rY', NULL, NULL, NULL, NULL, 14361.73, NULL, 0, 11749.76, '2024-03-28 08:11:17', '2024-03-28 08:11:17', NULL),
(4, 'OD1234477383233004', 1, 'CUSTOMER', NULL, 1, 2, 1, NULL, NULL, NULL, NULL, 'Phonepe', 'pay_NrjcEVxpCGVOfo', NULL, NULL, NULL, NULL, 1215, NULL, 0, 1130.23, '2024-03-28 10:01:09', '2024-03-28 10:01:09', NULL),
(5, 'OD1234477383233005', 1, 'CUSTOMER', NULL, 5, 2, 5, NULL, '2024-03-28 11:05:39', 1, NULL, 'Phonepe', 'pay_NrkhWhHGyECxWu', NULL, NULL, NULL, NULL, 1083.17, NULL, 0, 967.12, '2024-03-28 11:04:51', '2024-03-28 11:06:26', NULL),
(10, 'OD1234477383233010', 1, 'CUSTOMER', NULL, 6, 2, 1, NULL, NULL, NULL, NULL, 'Phonepe', 'pay_Nx1G6uzzjHMgaH', NULL, NULL, NULL, NULL, 6486.37, NULL, 53.1, 487, '2024-04-10 18:31:44', '2024-04-10 18:31:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `super_sub_category_id` int(11) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `car_brand_id` int(11) DEFAULT NULL,
  `car_model_id` int(11) DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `gst` double DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `category_id`, `sub_category_id`, `super_sub_category_id`, `product_type`, `car_brand_id`, `car_model_id`, `unit_price`, `quantity`, `sub_total`, `gst`, `total_amount`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 07:37:20', '2024-03-28 07:37:20', NULL),
(2, 2, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 07:44:51', '2024-03-28 07:44:51', NULL),
(3, 2, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 07:44:51', '2024-03-28 07:44:51', NULL),
(4, 2, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 07:44:51', '2024-03-28 07:44:51', NULL),
(5, 3, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 08:11:17', '2024-03-28 08:11:17', NULL),
(6, 3, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 08:11:17', '2024-03-28 08:11:17', NULL),
(7, 4, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 10:01:09', '2024-03-28 10:01:09', NULL),
(8, 4, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-28 10:01:09', '2024-03-28 10:01:09', NULL),
(9, 5, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-03-28 11:04:51', '2024-03-28 11:04:51', NULL),
(10, 10, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2024-04-10 18:31:44', '2024-04-10 18:31:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_statuses`
--

CREATE TABLE `order_statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_statuses`
--

INSERT INTO `order_statuses` (`id`, `status_name`, `active`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Pending', 1, '2024-01-27 05:09:04', '2024-01-27 05:09:04', NULL),
(2, 'Confirmed', 1, '2024-01-27 05:09:38', '2024-01-27 05:09:38', NULL),
(3, 'Packaging', 1, '2024-01-27 05:09:53', '2024-01-27 05:09:53', NULL),
(4, 'Out For Delivery', 1, '2024-01-27 05:10:17', '2024-01-27 05:10:17', NULL),
(5, 'Delivered', 1, '2024-01-27 05:13:06', '2024-01-27 05:13:06', NULL),
(6, 'Return Initiated', 1, '2024-01-27 05:13:25', '2024-01-27 05:13:25', NULL),
(7, 'Return Approved By Vendor', 1, '2024-01-27 05:13:43', '2024-01-27 05:13:43', NULL),
(8, 'Return Completed', 1, '2024-01-27 05:14:09', '2024-01-27 05:14:09', NULL),
(9, 'Cancelled By Customer', 1, '2024-01-27 05:14:30', '2024-01-27 05:14:30', NULL),
(10, 'Cancelled By Kardify', 1, '2024-01-27 05:14:48', '2024-01-27 05:14:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_status_logs`
--

CREATE TABLE `order_status_logs` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `order_status_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status_logs`
--

INSERT INTO `order_status_logs` (`id`, `order_id`, `order_status_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '2024-03-28 07:37:20', '2024-03-28 07:37:20', NULL),
(2, 2, 1, '2024-03-28 07:44:51', '2024-03-28 07:44:51', NULL),
(3, 3, 1, '2024-03-28 08:11:17', '2024-03-28 08:11:17', NULL),
(4, 4, 1, '2024-03-28 10:01:09', '2024-03-28 10:01:09', NULL),
(5, 5, 1, '2024-03-28 11:04:51', '2024-03-28 11:04:51', NULL),
(6, 5, 2, '2024-03-28 11:05:39', '2024-03-28 11:05:39', NULL),
(7, 5, 2, '2024-03-28 11:05:48', '2024-03-28 11:05:48', NULL),
(8, 5, 3, '2024-03-28 11:06:04', '2024-03-28 11:06:04', NULL),
(9, 5, 4, '2024-03-28 11:06:26', '2024-03-28 11:06:26', NULL),
(10, 10, 1, '2024-04-10 18:31:44', '2024-04-10 18:31:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `otp` varchar(10) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otps`
--

INSERT INTO `otps` (`id`, `user_id`, `dealer_id`, `otp`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, NULL, '6721', '2024-02-26 06:54:26', '2024-02-26 06:54:26', NULL),
(2, 2, NULL, '2752', '2024-02-26 07:30:18', '2024-02-26 07:30:18', NULL),
(3, NULL, NULL, '9661', '2024-02-26 07:37:41', '2024-02-26 07:37:41', NULL),
(4, NULL, NULL, '4115', '2024-02-26 07:41:03', '2024-02-26 07:41:03', NULL),
(5, 3, NULL, '4938', '2024-02-26 07:42:14', '2024-02-26 07:42:14', '2024-02-26 07:44:14'),
(6, 4, NULL, '1832', '2024-02-26 11:49:53', '2024-02-26 11:49:53', NULL),
(7, 5, NULL, '6890', '2024-02-26 11:52:27', '2024-02-26 11:52:27', '2024-02-26 11:53:24'),
(8, 6, NULL, '1527', '2024-02-26 12:08:17', '2024-02-26 12:08:17', '2024-02-26 12:08:34'),
(9, 7, NULL, '9571', '2024-02-26 12:10:23', '2024-02-26 12:10:23', '2024-02-26 12:11:10'),
(10, 3, NULL, '5441', '2024-02-26 12:40:00', '2024-02-26 12:40:00', '2024-02-26 12:42:00'),
(11, 3, NULL, '5256', '2024-02-26 12:50:39', '2024-02-26 12:50:39', NULL),
(12, 3, NULL, '9376', '2024-02-26 12:50:52', '2024-02-26 12:50:52', '2024-02-26 12:53:37'),
(13, 9, NULL, '5456', '2024-02-29 13:52:38', '2024-02-29 13:52:38', '2024-02-29 13:54:38'),
(14, 11, NULL, '1056', '2024-02-29 14:03:05', '2024-02-29 14:03:05', '2024-02-29 14:05:05'),
(15, 12, NULL, '9075', '2024-02-29 14:08:42', '2024-02-29 14:08:42', '2024-02-29 14:10:42'),
(16, 13, NULL, '6796', '2024-02-29 14:17:53', '2024-02-29 14:17:53', '2024-02-29 14:19:53'),
(17, NULL, 29, '6992', '2024-03-22 07:09:11', '2024-03-22 07:09:11', '2024-03-22 07:11:11'),
(18, NULL, 30, '7307', '2024-03-22 07:11:13', '2024-03-22 07:11:13', '2024-03-22 07:13:13'),
(19, NULL, 31, '5011', '2024-03-22 07:12:14', '2024-03-22 07:12:14', '2024-03-22 07:14:14'),
(20, NULL, 32, '5506', '2024-03-22 07:14:06', '2024-03-22 07:14:06', '2024-03-22 07:16:06'),
(21, NULL, 33, '8494', '2024-03-22 07:16:51', '2024-03-22 07:16:51', '2024-03-22 07:18:51'),
(22, NULL, 34, '4667', '2024-03-22 07:18:37', '2024-03-22 07:18:37', '2024-03-22 07:19:01'),
(23, NULL, 35, '1502', '2024-03-22 07:36:03', '2024-03-22 07:36:03', '2024-03-22 07:38:03'),
(24, NULL, 36, '9278', '2024-03-22 10:03:24', '2024-03-22 10:03:24', '2024-03-22 10:03:54'),
(25, NULL, 1, '2340', '2024-03-22 10:05:46', '2024-03-22 10:05:46', '2024-03-22 10:06:48'),
(26, NULL, 1, '4301', '2024-03-22 10:09:26', '2024-03-22 10:09:26', '2024-03-22 10:09:46'),
(27, NULL, 1, '1642', '2024-03-22 10:11:48', '2024-03-22 10:11:48', '2024-03-22 10:12:03'),
(28, NULL, 1, '8883', '2024-03-22 10:21:00', '2024-03-22 10:21:00', '2024-03-22 10:21:21'),
(29, NULL, 2, '4711', '2024-03-22 10:36:13', '2024-03-22 10:36:13', '2024-03-22 10:37:04'),
(30, 1, NULL, '4172', '2024-03-26 17:10:44', '2024-03-26 17:10:44', '2024-03-26 17:11:25'),
(31, 2, NULL, '4841', '2024-03-28 05:33:55', '2024-03-28 05:33:55', '2024-03-28 05:35:55'),
(32, 3, NULL, '9010', '2024-03-28 05:36:37', '2024-03-28 05:36:37', '2024-03-28 05:38:37'),
(33, 4, NULL, '8533', '2024-03-28 05:37:14', '2024-03-28 05:37:14', '2024-03-28 05:39:14'),
(34, 5, NULL, '2542', '2024-03-28 05:38:16', '2024-03-28 05:38:16', '2024-03-28 05:40:16'),
(35, 6, NULL, '1618', '2024-03-28 05:42:57', '2024-03-28 05:42:57', '2024-03-28 05:43:15'),
(36, 7, NULL, '7237', '2024-03-28 06:00:47', '2024-03-28 06:00:47', '2024-03-28 06:01:09'),
(37, NULL, 1, '6472', '2024-03-28 06:40:48', '2024-03-28 06:40:48', '2024-03-28 06:41:10'),
(38, 8, NULL, '7255', '2024-05-29 09:49:33', '2024-05-29 09:49:33', '2024-05-29 09:51:33'),
(39, 9, NULL, '5919', '2024-05-29 09:50:24', '2024-05-29 09:50:24', '2024-05-29 09:51:18'),
(40, 10, NULL, '8991', '2024-05-31 06:15:34', '2024-05-31 06:15:34', NULL),
(41, 11, NULL, '5263', '2024-05-31 06:15:56', '2024-05-31 06:15:56', NULL),
(42, 12, NULL, '1284', '2024-05-31 06:20:10', '2024-05-31 06:20:10', NULL),
(43, 13, NULL, '2195', '2024-05-31 06:23:01', '2024-05-31 06:23:01', NULL),
(44, 14, NULL, '1092', '2024-05-31 06:26:33', '2024-05-31 06:26:33', NULL),
(45, 15, NULL, '8426', '2024-05-31 06:31:00', '2024-05-31 06:31:00', NULL),
(46, 16, NULL, '6490', '2024-05-31 06:31:53', '2024-05-31 06:31:53', NULL),
(47, 17, NULL, '6185', '2024-05-31 06:34:20', '2024-05-31 06:34:20', NULL),
(48, 18, NULL, '6383', '2024-05-31 06:36:07', '2024-05-31 06:36:07', NULL),
(49, 19, NULL, '3858', '2024-05-31 06:39:22', '2024-05-31 06:39:22', NULL),
(50, 20, NULL, '4721', '2024-05-31 06:48:10', '2024-05-31 06:48:10', NULL),
(51, 21, NULL, '4033', '2024-05-31 06:54:31', '2024-05-31 06:54:31', NULL),
(52, 22, NULL, '1990', '2024-05-31 06:56:11', '2024-05-31 06:56:11', NULL),
(53, 23, NULL, '2205', '2024-05-31 07:07:38', '2024-05-31 07:07:38', NULL),
(54, 24, NULL, '8542', '2024-05-31 07:13:27', '2024-05-31 07:13:27', '2024-05-31 07:13:48'),
(55, 25, NULL, '2901', '2024-05-31 13:18:19', '2024-05-31 13:18:19', '2024-05-31 13:19:05'),
(56, 26, NULL, '9073', '2024-06-25 11:37:40', '2024-06-25 11:37:40', '2024-06-25 11:38:03'),
(57, 27, NULL, '5033', '2024-07-03 12:35:01', '2024-07-03 12:35:01', '2024-07-03 12:35:15');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(9999) DEFAULT NULL,
  `product_desc` varchar(2000) DEFAULT NULL,
  `product_brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `super_sub_category_id` int(11) DEFAULT NULL,
  `minimum_order` int(11) DEFAULT NULL,
  `default_price` double DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `is_features` tinyint(1) DEFAULT NULL,
  `is_latest` tinyint(1) DEFAULT NULL,
  `is_topDeals` tinyint(1) DEFAULT NULL,
  `is_bestSelling` tinyint(1) DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `discount_type` varchar(99) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `is_offer_avl` tinyint(1) DEFAULT NULL,
  `offer_discount` double DEFAULT NULL,
  `offer_discount_type` varchar(255) DEFAULT NULL,
  `offer_start_date` datetime DEFAULT NULL,
  `offer_end_date` datetime DEFAULT NULL,
  `tax_type` varchar(99) DEFAULT NULL,
  `tax_rate` double DEFAULT NULL,
  `product_type` varchar(99) DEFAULT NULL,
  `car_brand_id` int(11) DEFAULT NULL,
  `car_model_id` int(11) DEFAULT NULL,
  `start_year` int(11) DEFAULT NULL,
  `end_year` int(11) DEFAULT NULL,
  `has_exchange_policy` tinyint(1) DEFAULT NULL,
  `exchange_policy` varchar(99) DEFAULT NULL,
  `has_cancellation_policy` tinyint(1) DEFAULT NULL,
  `cancellation_policy` varchar(99) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `has_warranty` tinyint(1) DEFAULT NULL,
  `warranty` varchar(99) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `product_desc`, `product_brand_id`, `category_id`, `sub_category_id`, `super_sub_category_id`, `minimum_order`, `default_price`, `stock`, `is_features`, `is_latest`, `is_topDeals`, `is_bestSelling`, `is_popular`, `status`, `discount_type`, `discount`, `is_offer_avl`, `offer_discount`, `offer_discount_type`, `offer_start_date`, `offer_end_date`, `tax_type`, `tax_rate`, `product_type`, `car_brand_id`, `car_model_id`, `start_year`, `end_year`, `has_exchange_policy`, `exchange_policy`, `has_cancellation_policy`, `cancellation_policy`, `quantity`, `has_warranty`, `warranty`, `weight`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'subham', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:27', '2024-07-05 05:29:27'),
(2, 'tetettetete', '<p>asdasd</p>', 3, 3, 9, NULL, 12, 1099, 12, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 3, 'general', NULL, NULL, NULL, NULL, NULL, 'asd', NULL, 'asd', 12, NULL, '1', NULL, '2024-07-03 09:59:04', '2024-07-05 05:29:31', '2024-07-05 05:29:31'),
(3, 'subham1', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:24', '2024-07-05 05:29:24'),
(4, 'subham2', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:21', '2024-07-05 05:29:21'),
(5, 'subham3', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:17', '2024-07-05 05:29:17'),
(6, 'subham4', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:28:16', '2024-07-05 05:28:16'),
(7, 'subham5', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:28:22', '2024-07-05 05:28:22'),
(8, 'subham6', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:28:26', '2024-07-05 05:28:26'),
(9, 'subham7', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:28:29', '2024-07-05 05:28:29'),
(10, 'subham8', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:13', '2024-07-05 05:29:13'),
(11, 'subham9', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:06', '2024-07-05 05:29:06'),
(12, 'subham10', '<p>tretststsyjs sbasvgvda aghjsdbja</p>', 3, 3, 8, 5, 12, 1231, 21, NULL, 1, 1, NULL, 1, 1, 'percent', 3, NULL, NULL, NULL, NULL, NULL, 'percent', 21, 'general', NULL, NULL, NULL, NULL, NULL, 'sadasd', NULL, 'asdasd', 12, NULL, '12', NULL, '2024-07-03 05:54:05', '2024-07-05 05:29:03', '2024-07-05 05:29:03'),
(13, 'Pankaj  Iphone 15', '<p>tetetetets hbdsabdkjadnad</p>', 4, 3, 8, NULL, 12, 1099, 12, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 21, '', NULL, NULL, NULL, NULL, NULL, 'asda', NULL, 'dasd', 122, NULL, '12', NULL, '2024-07-03 12:09:59', '2024-07-05 05:29:36', '2024-07-05 05:29:36'),
(14, 'subahma', '<p>subham</p><ul><li>ajhsdjka</li><li>\'asdkjasd</li><li>adskjasda</li><li>daskjdal;kd;asdad</li><li>adsaskjsdnlasdsad</li><li>asdkhjbnakdasd</li><li>askdnakd</li></ul>', 4, 3, 8, NULL, 12, 1099, 12, NULL, NULL, NULL, NULL, NULL, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 12, '', NULL, NULL, NULL, NULL, NULL, 'asdasd', NULL, 'asdasd', 1212, NULL, '2112', NULL, '2024-07-03 12:11:26', '2024-07-05 05:54:49', '2024-07-05 05:54:49'),
(16, 'Iphone 18 pro max', '<p>sadasda</p><p>das</p><p>das</p><p>d</p><p>ads</p><p>as</p><p><br></p>', 4, 3, 8, NULL, 12, 1099, 12, NULL, NULL, NULL, NULL, NULL, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 12, '', NULL, NULL, NULL, NULL, NULL, 'asds', NULL, 'asa', 23, NULL, '1', NULL, '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(17, 'Iphone 19 pro max', '<p>asdas</p>', 4, 3, 8, NULL, 12, 1099, 12, NULL, NULL, NULL, NULL, NULL, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 21, '', NULL, NULL, NULL, NULL, NULL, 'asd', NULL, 'asd', 12, NULL, '21', NULL, '2024-07-04 07:10:02', '2024-07-05 05:26:10', '2024-07-05 05:26:10'),
(18, 'VERGEENO NUC 13 Extreme NUC13RNGi9 Core i9 Fully Loaded Desktop Mini PC', '<p>Specification:</p><ul><li>Intel Core i9-13900K</li><li>24C/32T</li><li>64GB DDR5 RAM</li><li>2TB PCIe Nvme SSD</li><li>Dual Thunderbolt</li><li>Win 11 Pro Included</li></ul>', 4, 7, 6, NULL, 12, 1223, 23, NULL, NULL, NULL, NULL, 0, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 7, '', NULL, NULL, NULL, NULL, NULL, 'adad', NULL, 'fasdasd', 23, NULL, '0', NULL, '2024-07-04 07:52:30', '2024-07-05 06:41:48', NULL),
(19, 'Lenovo IdeaCentre AIO 3 Intel Celeron ', '<ul><li>Processor: Intel Celeron 7305, 5C (1P + 4E) / 6T, P-core 1.1GHz, E-core 0.9GHz, 8MB</li><li>OS: Pre-Loaded Windows 11 Home with Lifetime Validity</li><li>Memory and Storage: 8GB DDR4-3200 RAM | Storage: 512GB SSD || Graphics: Integrated Intel UHD Graphics</li><li>Display: 21.5 inch Full HD (1920x1080) | Brightness: 250 nits | IPS Display | Anti Glare</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 12000, 23, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 7, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 05:34:50', '2024-07-05 08:54:47', '2024-07-05 08:54:47'),
(20, 'Lenovo IdeaCentre AIO 3 AMD Ryzen 3 3250U 23.8\" FHD IPS 3-Side Edgeless All-in-One Desktop with Alexa Built-in ', '<ul><li>Processor: AMD Ryzen 3 3250U | Speed: 2.6 GHz (Base) - 3.5 GHz (Max) | 2 Cores | 4 Threads | 4MB Cache</li><li>OS: Pre-Loaded Windows 11 Home with Lifetime Validity</li><li>Pre-Installed: MS Office Home and Student 2021</li><li>Memory and Storage: 8GB DDR4-2400 RAM, expandable up to 16GB | Storage: 512 GB SSD , expandable up to 1TB || Graphics: Integrated AMD Radeon Graphics</li><li>Display: 23.8-inch Full HD (1920x1080) | Brightness: 250 nits | IPS Display</li><li>Camera: HD 720p || Audio: 2x 3W HD Stereo speakers</li><li>Connectivity: Wi-Fi 6 (11ax, 2x2) | Bluetooth 5.1</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 12000, 23, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 7, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 05:43:45', '2024-07-05 06:41:48', NULL),
(21, 'VERGEENO NUC 10 NUC10i7FNH Core i7 Fully Loaded Desktop Mini PC', '<ul><li>Powered by Intel Core i7-10710U Processor (12M Cache, up to 4.70 GHz)</li><li>Operating Systems : Windows 10/11 Pro, 64-bit Preload (Included)</li><li>64GB DDR4-2666Mhz or Higher 1.2V SO-DIMM and 1TB M.2 Nvme SSD Included</li><li>Graphics Output - HDMI 2.0b; USB-C (DP1.2), Intel Ethernet Connection I219-V, Intel Wi-Fi 6 AX201</li><li>Three-year warranty for upgraded RAM / SSD, OS from VERGEENO. Three-year original warranty for remaining components from Intel</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 10000, 12, NULL, 1, NULL, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, 'percent', 7, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 05:47:49', '2024-07-05 06:41:48', NULL),
(22, 'VERGEENO RealSense D457 Depth Camera - GMSL/FAKRA, IP65 Rated Stereo Camera', '<ul><li>Vision Processor Board - RealSense Vision Processor D4</li><li>GMSL/FAKRA high bandwidth stereo camera, IP65 grade enclosure protecting it from dust ingress and projected water</li><li>D457 has an on-board Maxim serializer chip. A Maxim de-serializer is needed at host side to decode the streams</li><li>Depth Stream Output ResolutionUp to 1280 × 720 and Depth Stream Output Frame RateUp to 90 fps</li><li>In the Box - One 1/4‑20 UNC thread mounting point – Two M4 thread mounting points – Tripod</li></ul><p><br></p>', 4, 7, 7, NULL, 12, 1223, 23, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 05:53:41', '2024-07-05 05:53:48', NULL),
(23, 'VERGEENO NUC 12 Pro NUC12WSHi5 Core i5 Fully Loaded Desktop Mini PC', '<ul><li>Powered By Intel Core i5-1240P Processor (12M Cache, up to 4.40 GHz)</li><li>Operating Systems : Not Included in this Combo</li><li>16GB DDR4-3200 1.2V SO-DIMM and 500GB M.2 Nvme SSD Included</li><li>Graphics Output - 2x HDMI 2.1 TMDS Compatible, 2x DP 1.4a via Type C , Intel Ethernet Controller i225-V, Intel Wi-Fi 6E AX211(Gig+), 2x Thunderbolt 4</li><li>Three-year warranty for upgraded RAM / SSD, OS from VERGEENO. Three-year original warranty for remaining components from Intel</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 64000, 23, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 05:58:31', '2024-07-05 06:41:11', NULL),
(34, 'VERGEENO DiskStation DS1522+ - 5 Bay - (110TB) 22TB x 5 - Network Attached Storage', '<ul><li>AMD Ryzen R1600 (2 Core / 4 Thread) Upto 3.1Ghz</li><li>32GB DDR4 SODIMM Memory Included, 500GB x 2 nos Nvme M.2 Drives for Read and Write Cache</li><li>Connectivity Four built-in 1GbE ports with easy 10GbE optional</li><li>Scalability Up to 15 drive bays with 2 DX517 expansion units</li><li>Multi-Layered Backup Back up files, folders, physical devices, VMs, and SaaS applications with free solutions, and protect your NAS with built-in technologies.</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 1000, 23, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 06:32:20', '2024-07-05 06:41:48', NULL),
(35, 'VERGEENO - WD 240GB Green- 2.5 Inch - Solid State Drive (Pack of 5) - for Business/Enterprise', '<ul><li>Enhanced Storage For Your Everyday Computing Needs Boost your everyday computing experience in your desktop or laptop PC</li><li>Solid State Dependability Lightweight and shock resistant</li><li>Combo - Pack of 5 - 240GB 2.5 Inch SSD Drives for Bulk Business and Enterprises Users</li><li>lowest power consuming drives in the industry. And with less power used, your laptop runs longer.</li><li>Sequential Read Performance 545MB/s - Backed with 3 Year Warrany</li></ul><p><br></p>', 4, 7, 15, NULL, 12, 11000, 12, NULL, 1, 1, NULL, 1, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 06:40:32', '2024-07-05 06:41:14', NULL),
(36, 'VERGEENO Powered by AMD Athlon 3000G - AM4 - Processor ', '<ul><li>Powered by AMD Athlon 3000G (2 Core/ 4 Thread) - Base Clock 3.5GHz</li><li>Multi-VGA output support : HDMI/D-Sub ports and PCI-E - 1 x PCIe 3.0/2.0 x16 , 2 x PCIe 2.0 x1</li><li>Combo Includes : AMD Athlon 3000G, 4GB DDR4 RAM and A320M-K Motherboard prefitted</li><li>4 x SATA 6Gb/s port(s), gray, Support Raid 0, 1, 10 and M.2 (SATA &amp; PCIE 3.0 x 4 mode)</li><li>Three-year warranty from VERGEENO. Three-year original warranty for remaining components from AMD/Asrock</li></ul><p><br></p>', 4, 7, 7, NULL, 12, 2000, 23, NULL, 0, 0, 0, 0, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 06:49:04', '2024-07-05 13:52:28', NULL),
(37, 'VERGEENO - QNAP TS-433-4G - 4 Bay - 32TB (8TB X 4) Tower Network Attached Storage', '<ul><li>ARM 4-core Cortex-A55 2.0GHz processor, 4 GB on board (non-expandable)</li><li>The TS-433 comes with the QTS 5 operating system as standard, providing a next-generation usage experience with an updated system kernel, optimized user interface, and advanced security features.</li><li>one Gigabit LAN port, one 2.5 Gigabit LAN port, and supports four SATA 6Gb/s hard drives</li><li>With a built-in NPU (Neural network Processing Unit) processor, the TS-433 boosts QNAP AI Core (the AI-powered engine for image recognition) performance for high-speed face and object recognition.</li><li>Buttons- Power, Reset, USB Copy, 90W adapter (12VDC), 100-240VAC</li></ul><p><br></p>', 4, 7, 6, NULL, 12, 130000, 12, NULL, 0, 0, 0, 0, 1, 'percent', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05 06:57:26', '2024-07-05 13:52:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` int(11) NOT NULL,
  `attribute_name` varchar(99) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `attribute_name`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'RAM', 1, '2024-07-04 05:51:54', '2024-07-04 05:51:54', NULL),
(2, 'Colour', 1, '2024-07-04 07:08:11', '2024-07-04 07:08:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes_associations`
--

CREATE TABLE `product_attributes_associations` (
  `id` int(11) NOT NULL,
  `combination` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_attributes_associations`
--

INSERT INTO `product_attributes_associations` (`id`, `combination`, `price`, `stock`, `product_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, '128gb', 200, 20, 16, '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(2, '256gb', 300, 0, 16, '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(3, '556gb', 200, 34, 16, '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(4, '1tb', 455, 54, 16, '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL),
(5, '128gb-Red', 300, 12, 17, '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(6, '128gb-Titanium', 329, 32, 17, '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(7, '1tb-Red', 400, 33, 17, '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(8, '1tb-Titanium', 1000, 21, 17, '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL),
(9, '128', 12000, 12, 19, '2024-07-05 05:34:50', '2024-07-05 05:34:50', NULL),
(10, 'red', 11000, 1, 20, '2024-07-05 05:43:45', '2024-07-05 05:43:45', NULL),
(11, '128', 12000, 12, 21, '2024-07-05 05:47:49', '2024-07-05 05:47:49', NULL),
(12, '256', 65000, 12, 23, '2024-07-05 05:58:31', '2024-07-05 05:58:31', NULL),
(13, 'red', 11000, 1, 34, '2024-07-05 06:32:20', '2024-07-05 06:32:20', NULL),
(14, 'green', 10000, 12, 35, '2024-07-05 06:40:32', '2024-07-05 06:40:32', NULL),
(15, 'red-8GB', 3000, 0, 36, '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(16, 'green-8GB', 3000, 2, 36, '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL),
(17, 'black-8GB', 12000, 0, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(18, 'black-4GB', 200, 2, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(19, 'black-12GB', 13000, 1, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(20, 'red-8GB', 13000, 2, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(21, 'red-4GB', 130000, 0, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(22, 'red-12GB', 12000, 2, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(23, 'green-8GB', 12000, 1, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(24, 'green-4GB', 12000, 0, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL),
(25, 'green-12GB', 12000, 2, 37, '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_brands`
--

CREATE TABLE `product_brands` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_brands`
--

INSERT INTO `product_brands` (`id`, `brand_name`, `image_url`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Lenso', '/uploads/productbrands/1711447588059.png', 0, '2024-03-26 10:06:28', '2024-06-27 10:00:18', '2024-06-27 10:00:18'),
(2, 'Lenso Wheels', '/uploads/productbrands/1711539530846.png', 1, '2024-03-27 11:38:50', '2024-06-27 10:00:20', '2024-06-27 10:00:20'),
(3, 'BMW', '/uploads/productbrands/1719482895988.png', 1, '2024-06-27 10:08:15', '2024-07-05 05:26:24', '2024-07-05 05:26:24'),
(4, 'Apple', '/uploads/productbrands/1720008293956.png', 1, '2024-07-03 12:04:53', '2024-07-03 12:04:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_discount_associations`
--

CREATE TABLE `product_discount_associations` (
  `id` int(11) NOT NULL,
  `discount_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_discount_associations`
--

INSERT INTO `product_discount_associations` (`id`, `discount_id`, `product_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 3, '2024-04-18 06:15:13', '2024-04-18 06:15:13', NULL),
(2, 2, 5, '2024-04-18 06:16:19', '2024-04-18 06:16:19', NULL),
(3, 3, 4, '2024-04-18 06:19:58', '2024-04-18 06:19:58', NULL),
(4, 3, 3, '2024-04-18 06:19:58', '2024-04-18 06:19:58', NULL),
(5, 3, 5, '2024-04-18 06:19:58', '2024-04-18 06:19:58', NULL),
(6, 4, 5, '2024-04-18 06:40:37', '2024-04-18 06:40:37', NULL),
(7, 5, 5, '2024-04-18 06:44:54', '2024-04-18 06:44:54', NULL),
(8, 6, 4, '2024-04-18 06:55:07', '2024-04-18 06:55:07', NULL),
(9, 6, 3, '2024-04-18 06:55:07', '2024-04-18 06:55:07', NULL),
(10, 6, 2, '2024-04-18 06:55:07', '2024-04-18 06:55:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_faq_associations`
--

CREATE TABLE `product_faq_associations` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `faq_heading` varchar(999) DEFAULT NULL,
  `faq_content` varchar(999) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_faq_associations`
--

INSERT INTO `product_faq_associations` (`id`, `product_id`, `faq_heading`, `faq_content`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 13, 'Testing heading 1', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1, '2024-06-29 13:42:57', NULL, NULL),
(2, 11, 'Testing heading 2', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1, '2024-06-29 13:42:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `createdAt`, `updatedAt`, `deletedAt`, `status`) VALUES
(1, 1, '/uploads/products/1719986045735.png', '2024-07-03 05:54:05', '2024-07-03 05:54:05', NULL, 1),
(2, 1, '/uploads/products/1719986045748.png', '2024-07-03 05:54:05', '2024-07-03 05:54:05', NULL, 1),
(3, 2, '/uploads/products/1720000744783.png', '2024-07-03 09:59:04', '2024-07-03 09:59:04', NULL, 1),
(4, 13, '/uploads/products/1720008599636.png', '2024-07-03 12:09:59', '2024-07-03 12:09:59', NULL, 1),
(5, 14, '/uploads/products/1720008686757.png', '2024-07-03 12:11:26', '2024-07-03 12:11:26', NULL, 1),
(6, 14, '/uploads/products/1720008686770.png', '2024-07-03 12:11:26', '2024-07-03 12:11:26', NULL, 1),
(7, 14, '/uploads/products/1720008686783.png', '2024-07-03 12:11:26', '2024-07-03 12:11:26', NULL, 1),
(8, 15, '/uploads/products/1720074119154.png', '2024-07-04 06:21:59', '2024-07-04 06:21:59', NULL, 1),
(9, 15, '/uploads/products/1720074119167.png', '2024-07-04 06:21:59', '2024-07-04 06:21:59', NULL, 1),
(10, 16, '/uploads/products/1720074800848.png', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL, 1),
(11, 16, '/uploads/products/1720074800863.png', '2024-07-04 06:33:20', '2024-07-04 06:33:20', NULL, 1),
(12, 17, '/uploads/products/1720077002288.png', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL, 1),
(13, 17, '/uploads/products/1720077002303.png', '2024-07-04 07:10:02', '2024-07-04 07:10:02', NULL, 1),
(14, 18, '/uploads/products/1720079550712.jpg', '2024-07-04 07:52:30', '2024-07-04 07:52:30', NULL, 1),
(15, 19, '/uploads/products/1720157690055.jpg', '2024-07-05 05:34:50', '2024-07-05 05:34:50', NULL, 1),
(16, 20, '/uploads/products/1720158225066.webp', '2024-07-05 05:43:45', '2024-07-05 05:43:45', NULL, 1),
(17, 21, '/uploads/products/1720158469568.jpg', '2024-07-05 05:47:49', '2024-07-05 05:47:49', NULL, 1),
(18, 22, '/uploads/products/1720158821542.jpg', '2024-07-05 05:53:41', '2024-07-05 05:53:41', NULL, 1),
(19, 23, '/uploads/products/1720159111027.jpg', '2024-07-05 05:58:31', '2024-07-05 05:58:31', NULL, 1),
(20, 34, '/uploads/products/1720161140969.jpg', '2024-07-05 06:32:20', '2024-07-05 06:32:20', NULL, 1),
(21, 35, '/uploads/products/1720161632595.jpg', '2024-07-05 06:40:32', '2024-07-05 06:40:32', NULL, 1),
(22, 36, '/uploads/products/1720162144145.jpg', '2024-07-05 06:49:04', '2024-07-05 06:49:04', NULL, 1),
(23, 37, '/uploads/products/1720162646937.jpg', '2024-07-05 06:57:26', '2024-07-05 06:57:26', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `static_pages`
--

CREATE TABLE `static_pages` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `about_us` varchar(2000) DEFAULT NULL,
  `about_status` tinyint(1) DEFAULT NULL,
  `contact_us` varchar(2000) DEFAULT NULL,
  `contact_status` tinyint(1) DEFAULT NULL,
  `privacy_policy` varchar(2000) DEFAULT NULL,
  `privacy_status` tinyint(1) DEFAULT NULL,
  `cancellation_policy` varchar(2000) DEFAULT NULL,
  `cancellation_status` tinyint(1) DEFAULT NULL,
  `refund_policy` varchar(2000) DEFAULT NULL,
  `refund_status` tinyint(1) DEFAULT NULL,
  `return_policy` varchar(2000) DEFAULT NULL,
  `return_status` tinyint(1) DEFAULT NULL,
  `shipping_policy` varchar(2000) DEFAULT NULL,
  `shipping_status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `static_pages`
--

INSERT INTO `static_pages` (`id`, `image_url`, `about_us`, `about_status`, `contact_us`, `contact_status`, `privacy_policy`, `privacy_status`, `cancellation_policy`, `cancellation_status`, `refund_policy`, `refund_status`, `return_policy`, `return_status`, `shipping_policy`, `shipping_status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, '/uploads/staticpage/1709057152791.png', '<p>subham jena kuma</p>', 0, '<p>abcd</p>', 1, '<p>Subhamasasdasdasd</p>', 1, '<p>Cancelled doneavbcvb</p>', 0, '<p>ReFund Policy working</p>', 0, '<p>retuns</p>', 0, '<p>hehehehhe</p>', 0, '2024-02-21 04:12:37', '2024-02-27 12:35:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `store_infos`
--

CREATE TABLE `store_infos` (
  `id` int(11) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_infos`
--

INSERT INTO `store_infos` (`id`, `contact_name`, `status`, `value`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'email_1', 1, 'Email 1', '2024-02-22 07:22:30', '2024-02-22 13:43:42', NULL),
(2, 'email_2', 1, 'email 2', '2024-02-22 07:22:30', '2024-02-22 13:43:44', NULL),
(3, 'number_1', 1, 'number 1', '2024-02-22 07:22:30', '2024-02-23 06:47:39', NULL),
(4, 'number_2', 1, 'number 2', '2024-02-22 07:22:30', '2024-02-22 13:43:55', NULL),
(5, 'whatsapp_1', 1, 'what 1', '2024-02-22 07:22:30', '2024-02-22 13:43:47', NULL),
(6, 'whatsapp_2', 1, 'what 2', '2024-02-22 07:22:30', '2024-02-22 13:43:51', NULL),
(7, 'address_1', 1, 'address 1', '2024-02-22 07:22:30', '2024-02-22 13:43:49', NULL),
(8, 'address_2', 1, 'address 2', '2024-02-22 07:22:30', '2024-02-22 13:43:57', NULL),
(9, 'linkedin', 1, 'linkedin', '2024-02-22 07:22:30', '2024-02-23 01:51:51', NULL),
(10, 'instagram', 1, 'instagram', '2024-02-22 07:22:30', '2024-02-22 13:44:01', NULL),
(11, 'facebook', 1, 'facebook', '2024-02-22 07:22:30', '2024-02-22 13:44:03', NULL),
(12, 'twitter', 1, 'twitter', '2024-02-22 07:22:30', '2024-02-22 13:44:05', NULL),
(13, 'website', 1, 'website', '2024-02-22 07:22:30', '2024-02-22 13:44:07', NULL),
(14, 'youtube', 1, 'youtube', '2024-02-22 07:22:30', '2024-02-22 13:44:09', NULL),
(15, 'Gpay', 1, NULL, '2024-02-22 07:22:30', '2024-02-22 07:22:30', NULL),
(16, 'Amazonpay', 1, NULL, '2024-02-22 07:22:30', '2024-02-22 07:22:30', NULL),
(17, 'Phonepe', 0, NULL, '2024-02-22 07:22:30', '2024-02-23 01:51:55', NULL),
(18, 'MasterCard', 1, NULL, '2024-02-22 07:22:30', '2024-02-22 07:22:30', NULL),
(19, 'VISA', 1, NULL, '2024-02-22 07:22:30', '2024-02-23 00:38:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `description` varchar(9999) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT NULL,
  `rejected_reason` varchar(255) DEFAULT NULL,
  `story_type` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stories`
--

INSERT INTO `stories` (`id`, `customer_id`, `image_url`, `heading`, `description`, `is_approved`, `rejected_reason`, `story_type`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, '/uploads/stories/1711538956035.png', 'jsdhdkl', 'asjhdklas', 1, NULL, 'image', 1, '2024-03-27 11:29:16', '2024-03-27 13:23:23', NULL),
(2, 1, '/uploads/stories/1711538982006.png', 'asjhd', 'asdjhk', 1, NULL, 'image', 1, '2024-03-27 11:29:42', '2024-03-27 13:23:23', NULL),
(3, 1, '/uploads/stories/1711539075900.mp4', 'asd', 'asd', 1, NULL, 'video', 1, '2024-03-27 11:31:15', '2024-03-27 13:23:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stories_product_associations`
--

CREATE TABLE `stories_product_associations` (
  `id` int(11) NOT NULL,
  `story_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscribed_customers`
--

CREATE TABLE `subscribed_customers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(99) NOT NULL,
  `category_id` int(99) NOT NULL,
  `sub_category_name` varchar(99) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `image_url` varchar(99) NOT NULL,
  `banner_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `category_id`, `sub_category_name`, `status`, `image_url`, `banner_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 2, 'Accesories', 1, '/uploads/subcategories/1711447231939.jpg', NULL, '2024-03-26 10:00:31', '2024-05-26 12:29:53', '2024-05-26 12:29:53'),
(2, 2, 'Tail lights', 1, '/uploads/subcategories/1711447284536.jpg', NULL, '2024-03-26 10:01:24', '2024-03-26 10:01:24', NULL),
(3, 1, 'Accesories', 1, '/uploads/subcategories/1711447298387.jpg', NULL, '2024-03-26 10:01:38', '2024-05-26 12:30:04', '2024-05-26 12:30:04'),
(4, 1, 'Tail lights', 1, '/uploads/subcategories/1711447318936.png', NULL, '2024-03-26 10:01:58', '2024-05-26 12:30:01', '2024-05-26 12:30:01'),
(5, 5, 'asdasdsad', 1, '/uploads/default/default.png', NULL, '2024-03-30 04:46:51', '2024-05-26 12:29:57', '2024-05-26 12:29:57'),
(6, 7, 'Intel', 1, '/uploads/default/default.png', NULL, '2024-05-26 12:30:29', '2024-05-26 12:30:29', NULL),
(7, 7, 'Pentium', 1, '/uploads/default/default.png', NULL, '2024-05-26 12:30:44', '2024-05-26 12:30:44', NULL),
(8, 3, 'SmartPhone', 1, '/uploads/default/default.png', NULL, '2024-05-26 12:32:31', '2024-05-26 12:32:31', NULL),
(9, 3, 'Features Phone', 1, '/uploads/default/default.png', NULL, '2024-05-26 12:32:46', '2024-05-26 12:32:46', NULL),
(10, 14, 'Window', 1, '/uploads/default/default.png', NULL, '2024-05-27 06:59:48', '2024-05-27 06:59:48', NULL),
(11, 13, 'Samsung', 1, '/uploads/default/default.png', NULL, '2024-05-27 06:59:56', '2024-05-27 06:59:56', NULL),
(12, 13, 'Sandisk', 1, '/uploads/default/default.png', NULL, '2024-05-27 07:00:11', '2024-05-27 07:00:11', NULL),
(13, 11, 'Nvidia', 1, '/uploads/default/default.png', NULL, '2024-05-27 07:00:33', '2024-05-27 07:00:33', NULL),
(14, 11, 'RTX', 1, '/uploads/default/default.png', NULL, '2024-05-27 07:00:44', '2024-05-27 07:00:44', NULL),
(15, 7, 'Xtel', 1, '/uploads/default/default.png', NULL, '2024-05-27 07:01:03', '2024-05-27 07:01:03', NULL),
(16, 17, 'Case Name', 1, '/uploads/default/default.png', NULL, '2024-07-05 09:04:24', '2024-07-05 09:04:24', NULL),
(17, 17, 'Full Tower', 1, '/uploads/default/default.png', NULL, '2024-07-05 09:05:05', '2024-07-05 09:05:05', NULL),
(18, 18, 'External Optical Drive', 1, '/uploads/default/default.png', NULL, '2024-07-05 09:06:32', '2024-07-05 09:06:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `super_sub_categories`
--

CREATE TABLE `super_sub_categories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `super_sub_category_name` varchar(99) NOT NULL,
  `image_url` varchar(99) NOT NULL,
  `banner_id` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `super_sub_categories`
--

INSERT INTO `super_sub_categories` (`id`, `category_id`, `sub_category_id`, `super_sub_category_name`, `image_url`, `banner_id`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 3, 'Subham exterior', '/uploads/supersubcategories/1711447492219.jpg', NULL, 1, '2024-05-26 12:33:58', '2024-05-26 12:33:58', '2024-05-26 12:33:58'),
(2, 2, 1, 'Subham Interior', '/uploads/supersubcategories/1711447505863.png', NULL, 1, '2024-05-26 12:33:53', '2024-05-26 12:33:53', '2024-05-26 12:33:53'),
(3, 1, 3, '3eqwed', '/uploads/default/default.png', NULL, 1, '2024-05-26 12:33:49', '2024-05-26 12:33:49', '2024-05-26 12:33:49'),
(4, 3, 8, 'Samsung', '/uploads/default/default.png', NULL, 1, '2024-05-26 12:33:12', '2024-05-26 12:33:12', NULL),
(5, 3, 8, 'Xiomi', '/uploads/default/default.png', NULL, 1, '2024-05-26 12:33:27', '2024-05-26 12:33:27', NULL),
(6, 3, 9, 'Nokia', '/uploads/default/default.png', NULL, 1, '2024-05-26 12:33:40', '2024-05-26 12:33:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `description` varchar(999) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `customer_id`, `rating`, `heading`, `description`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 4, 'Best', 'test', 1, '2024-03-27 11:40:55', '2024-03-27 11:40:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(99) DEFAULT NULL,
  `phone` int(99) DEFAULT NULL,
  `password` int(99) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `add_type` varchar(255) NOT NULL,
  `add1` varchar(500) DEFAULT NULL,
  `add2` varchar(500) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `landmark` varchar(500) DEFAULT NULL,
  `zipcode` varchar(100) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `add_type`, `add1`, `add2`, `city`, `state`, `country`, `area`, `landmark`, `zipcode`, `fullname`, `mobile`, `email`, `lat`, `lng`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'home', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'Rr nagar', 'Rr nagar', NULL, 'Subham', '1234567892', NULL, NULL, NULL, '2024-03-28 10:00:34', '2024-03-28 10:00:34', NULL),
(2, 1, 'office', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'Rr nagar', 'Rr nagar', NULL, 'Subham', '1234567893', NULL, NULL, NULL, '2024-03-28 10:14:17', '2024-03-28 10:14:17', NULL),
(3, 1, 'office', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'Rr nagar', 'Rr nagar', NULL, 'Subham', '1234567893', NULL, NULL, NULL, '2024-03-28 10:17:02', '2024-03-28 10:17:02', NULL),
(4, 1, 'other', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'Rr nagar', 'Rr nagar', NULL, 'Subham', '1234567892', NULL, NULL, NULL, '2024-03-28 10:17:22', '2024-03-28 10:17:22', NULL),
(5, 1, 'other', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'RR nagar', 'Rr nagar', NULL, 'Subham', '1234567892', NULL, NULL, NULL, '2024-03-28 10:18:24', '2024-03-28 10:18:24', NULL),
(6, 1, 'office', 'Jurysoft', '', 'Bengaluru', 'Karnataka', 'India', 'feeaszd', 'Rr nagar', '560098', 'Laxmi Narayan', '1234567893', NULL, NULL, NULL, '2024-04-10 18:25:18', '2024-04-10 18:25:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `variants`
--

CREATE TABLE `variants` (
  `id` int(11) NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variants_attributes`
--

CREATE TABLE `variants_attributes` (
  `id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `attribute_name` varchar(255) NOT NULL,
  `attribute_value` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `combination_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `dealer_id`, `product_id`, `combination_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 26, NULL, 16, 1, '2024-07-08 09:43:49', '2024-07-08 09:43:49', '2024-07-08 09:44:34'),
(2, 26, NULL, 16, 1, '2024-07-08 09:44:35', '2024-07-08 09:44:35', '2024-07-08 09:44:36'),
(3, 26, NULL, 16, 3, '2024-07-08 09:44:39', '2024-07-08 09:44:39', '2024-07-08 09:44:47'),
(4, 26, NULL, 16, 1, '2024-07-08 09:44:41', '2024-07-08 09:44:41', '2024-07-08 09:44:52'),
(5, 26, NULL, 16, 4, '2024-07-08 09:44:44', '2024-07-08 09:44:44', '2024-07-08 09:44:51'),
(6, 26, NULL, 16, 1, '2024-07-08 09:45:46', '2024-07-08 09:45:46', '2024-07-08 09:45:47'),
(7, 26, NULL, 16, 1, '2024-07-08 09:45:53', '2024-07-08 09:45:53', '2024-07-08 09:45:54'),
(8, 26, NULL, 16, 1, '2024-07-08 09:46:00', '2024-07-08 09:46:00', '2024-07-08 09:46:02'),
(9, 26, NULL, 16, 1, '2024-07-08 09:46:02', '2024-07-08 09:46:02', '2024-07-08 09:46:03'),
(10, 26, NULL, 16, 1, '2024-07-08 09:46:04', '2024-07-08 09:46:04', '2024-07-08 09:46:14'),
(11, 26, NULL, 16, 1, '2024-07-08 09:46:15', '2024-07-08 09:46:15', '2024-07-08 09:46:15'),
(12, 26, NULL, 16, 4, '2024-07-08 09:46:19', '2024-07-08 09:46:19', '2024-07-08 09:46:44'),
(13, 26, NULL, 16, 3, '2024-07-08 09:46:20', '2024-07-08 09:46:20', '2024-07-08 09:46:42'),
(14, 26, NULL, 16, 1, '2024-07-08 09:46:22', '2024-07-08 09:46:22', '2024-07-08 09:46:24'),
(15, 26, NULL, 16, 1, '2024-07-08 09:46:31', '2024-07-08 09:46:31', '2024-07-08 09:46:33'),
(16, 26, NULL, 16, 1, '2024-07-08 09:46:39', '2024-07-08 09:46:39', '2024-07-08 09:46:40'),
(17, 26, NULL, 16, 4, '2024-07-08 09:47:02', '2024-07-08 09:47:02', '2024-07-08 09:47:03'),
(18, 26, NULL, 16, 4, '2024-07-08 09:47:04', '2024-07-08 09:47:04', '2024-07-08 09:51:48'),
(19, 26, NULL, 16, 1, '2024-07-08 09:47:09', '2024-07-08 09:47:09', '2024-07-08 09:58:11'),
(20, 26, NULL, 16, 3, '2024-07-08 09:47:12', '2024-07-08 09:47:12', '2024-07-08 09:47:16'),
(21, 26, NULL, 16, 3, '2024-07-08 09:47:42', '2024-07-08 09:47:42', '2024-07-08 09:47:43'),
(22, 26, NULL, 16, 3, '2024-07-08 09:47:50', '2024-07-08 09:47:50', '2024-07-08 09:47:50'),
(23, 26, NULL, 16, 3, '2024-07-08 09:47:58', '2024-07-08 09:47:58', '2024-07-08 09:47:59'),
(24, 26, NULL, 16, 3, '2024-07-08 09:48:00', '2024-07-08 09:48:00', '2024-07-08 09:48:05'),
(25, 26, NULL, 16, 3, '2024-07-08 09:48:06', '2024-07-08 09:48:06', '2024-07-08 09:48:07'),
(26, 26, NULL, 16, 3, '2024-07-08 09:48:07', '2024-07-08 09:48:07', '2024-07-08 09:51:51'),
(27, 26, NULL, 16, 4, '2024-07-08 09:57:53', '2024-07-08 09:57:53', '2024-07-08 09:57:57'),
(28, 26, NULL, 16, 3, '2024-07-08 09:57:55', '2024-07-08 09:57:55', '2024-07-08 09:57:58'),
(29, 26, NULL, 16, 4, '2024-07-08 09:58:02', '2024-07-08 09:58:02', '2024-07-08 10:07:20'),
(30, 26, NULL, 16, 3, '2024-07-08 09:58:12', '2024-07-08 09:58:12', '2024-07-08 10:07:17'),
(31, 26, NULL, 16, 1, '2024-07-08 09:58:16', '2024-07-08 09:58:16', '2024-07-08 10:07:10'),
(32, 26, NULL, 16, 1, '2024-07-08 10:07:15', '2024-07-08 10:07:15', '2024-07-08 10:07:15'),
(33, 24, NULL, 37, 18, '2024-07-08 10:07:30', '2024-07-08 10:07:30', '2024-07-08 10:07:34'),
(34, 26, NULL, 16, 1, '2024-07-08 10:09:10', '2024-07-08 10:09:10', '2024-07-08 10:09:24'),
(35, 26, NULL, 16, 4, '2024-07-08 10:09:13', '2024-07-08 10:09:13', '2024-07-08 10:09:21'),
(36, 26, NULL, 16, 3, '2024-07-08 10:09:15', '2024-07-08 10:09:15', '2024-07-08 10:09:16'),
(37, 26, NULL, 16, 1, '2024-07-08 10:14:27', '2024-07-08 10:14:27', '2024-07-08 10:14:28'),
(38, 24, NULL, 36, 16, '2024-07-08 10:41:37', '2024-07-08 10:41:37', '2024-07-08 10:41:56'),
(39, 24, NULL, 36, 16, '2024-07-08 10:41:58', '2024-07-08 10:41:58', '2024-07-08 10:42:03'),
(40, 24, NULL, 36, 16, '2024-07-08 10:42:19', '2024-07-08 10:42:19', '2024-07-08 10:42:21'),
(41, 24, NULL, 36, 16, '2024-07-08 10:42:23', '2024-07-08 10:42:23', NULL),
(42, 24, NULL, 23, 12, '2024-07-08 11:40:07', '2024-07-08 11:40:07', NULL),
(43, 26, NULL, 36, 16, '2024-07-08 11:42:26', '2024-07-08 11:42:26', '2024-07-08 11:43:53'),
(44, 26, NULL, 35, 14, '2024-07-08 11:42:28', '2024-07-08 11:42:28', '2024-07-08 11:42:29'),
(45, 26, NULL, 35, 14, '2024-07-08 11:42:31', '2024-07-08 11:42:31', '2024-07-08 11:42:32'),
(46, 26, NULL, 37, 20, '2024-07-08 11:42:53', '2024-07-08 11:42:53', NULL),
(47, 26, NULL, 37, 23, '2024-07-08 11:42:55', '2024-07-08 11:42:55', '2024-07-08 11:43:54'),
(48, 26, NULL, 35, 14, '2024-07-08 11:43:39', '2024-07-08 11:43:39', '2024-07-08 11:43:41'),
(49, 26, NULL, 18, NULL, '2024-07-08 11:48:18', '2024-07-08 11:48:18', '2024-07-08 11:48:26'),
(50, 26, NULL, 16, 1, '2024-07-08 11:48:28', '2024-07-08 11:48:28', '2024-07-08 11:48:29'),
(51, 26, NULL, 16, 1, '2024-07-08 11:48:30', '2024-07-08 11:48:30', '2024-07-08 11:53:15'),
(52, 26, NULL, 16, 3, '2024-07-08 11:48:32', '2024-07-08 11:48:32', '2024-07-08 11:53:18'),
(53, 26, NULL, 16, 4, '2024-07-08 11:48:35', '2024-07-08 11:48:35', NULL),
(54, 26, NULL, 37, 19, '2024-07-08 11:49:36', '2024-07-08 11:49:36', '2024-07-08 11:49:37'),
(55, 26, NULL, 16, 3, '2024-07-08 12:00:05', '2024-07-08 12:00:05', NULL),
(56, 24, NULL, 21, 11, '2024-07-08 12:10:49', '2024-07-08 12:10:49', '2024-07-08 12:10:51'),
(57, 26, NULL, 21, 11, '2024-07-08 12:34:49', '2024-07-08 12:34:49', '2024-07-08 12:34:50'),
(58, 26, NULL, 23, 12, '2024-07-08 12:35:52', '2024-07-08 12:35:52', '2024-07-08 13:14:18'),
(59, 26, NULL, 22, NULL, '2024-07-08 12:49:16', '2024-07-08 12:49:16', '2024-07-08 12:49:17'),
(60, 26, NULL, 22, NULL, '2024-07-08 12:54:10', '2024-07-08 12:54:10', '2024-07-08 12:54:10'),
(61, 26, NULL, 21, 11, '2024-07-08 13:01:49', '2024-07-08 13:01:49', '2024-07-08 13:01:50'),
(62, 26, NULL, 35, 14, '2024-07-08 13:01:52', '2024-07-08 13:01:52', '2024-07-08 13:14:25'),
(63, 26, NULL, 22, NULL, '2024-07-08 13:08:15', '2024-07-08 13:08:15', '2024-07-08 13:08:17'),
(64, 26, NULL, 22, NULL, '2024-07-08 13:08:35', '2024-07-08 13:08:35', '2024-07-08 13:14:17'),
(65, 26, NULL, 20, 10, '2024-07-08 13:08:51', '2024-07-08 13:08:51', '2024-07-08 13:14:29'),
(66, 26, NULL, 34, 13, '2024-07-08 13:08:53', '2024-07-08 13:08:53', '2024-07-08 13:14:27'),
(67, 26, NULL, 23, 12, '2024-07-08 13:14:19', '2024-07-08 13:14:19', '2024-07-08 13:14:34'),
(68, 26, NULL, 22, NULL, '2024-07-08 13:14:21', '2024-07-08 13:14:21', '2024-07-08 13:14:32'),
(69, 26, NULL, 21, 11, '2024-07-08 13:14:22', '2024-07-08 13:14:22', '2024-07-08 13:14:23'),
(70, 26, NULL, 23, 12, '2024-07-08 13:14:37', '2024-07-08 13:14:37', '2024-07-08 13:14:59'),
(71, 26, NULL, 34, 13, '2024-07-08 13:14:39', '2024-07-08 13:14:39', '2024-07-08 13:15:01'),
(72, 24, NULL, 21, 11, '2024-07-08 13:20:07', '2024-07-08 13:20:07', NULL),
(73, 26, NULL, 23, 12, '2024-07-08 13:23:14', '2024-07-08 13:23:14', '2024-07-08 13:23:40'),
(74, 26, NULL, 23, 12, '2024-07-08 13:27:59', '2024-07-08 13:27:59', '2024-07-08 13:28:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attributes_combinations`
--
ALTER TABLE `attributes_combinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banner_product_associations`
--
ALTER TABLE `banner_product_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_brands`
--
ALTER TABLE `car_brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_lists`
--
ALTER TABLE `car_lists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_models`
--
ALTER TABLE `car_models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dealers`
--
ALTER TABLE `dealers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_types`
--
ALTER TABLE `delivery_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `installers`
--
ALTER TABLE `installers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers_product_associations`
--
ALTER TABLE `offers_product_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_statuses`
--
ALTER TABLE `order_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_attributes_associations`
--
ALTER TABLE `product_attributes_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_brands`
--
ALTER TABLE `product_brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_discount_associations`
--
ALTER TABLE `product_discount_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_faq_associations`
--
ALTER TABLE `product_faq_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `static_pages`
--
ALTER TABLE `static_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_infos`
--
ALTER TABLE `store_infos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stories_product_associations`
--
ALTER TABLE `stories_product_associations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribed_customers`
--
ALTER TABLE `subscribed_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `super_sub_categories`
--
ALTER TABLE `super_sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `variants`
--
ALTER TABLE `variants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `variants_attributes`
--
ALTER TABLE `variants_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `attributes_combinations`
--
ALTER TABLE `attributes_combinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `banner_product_associations`
--
ALTER TABLE `banner_product_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `car_brands`
--
ALTER TABLE `car_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `car_lists`
--
ALTER TABLE `car_lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `car_models`
--
ALTER TABLE `car_models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `dealers`
--
ALTER TABLE `dealers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `delivery_types`
--
ALTER TABLE `delivery_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `installers`
--
ALTER TABLE `installers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offers_product_associations`
--
ALTER TABLE `offers_product_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_statuses`
--
ALTER TABLE `order_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_attributes_associations`
--
ALTER TABLE `product_attributes_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `product_brands`
--
ALTER TABLE `product_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_discount_associations`
--
ALTER TABLE `product_discount_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_faq_associations`
--
ALTER TABLE `product_faq_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `static_pages`
--
ALTER TABLE `static_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_infos`
--
ALTER TABLE `store_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stories_product_associations`
--
ALTER TABLE `stories_product_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscribed_customers`
--
ALTER TABLE `subscribed_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(99) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `super_sub_categories`
--
ALTER TABLE `super_sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `variants`
--
ALTER TABLE `variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `variants_attributes`
--
ALTER TABLE `variants_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
