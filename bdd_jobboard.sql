-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : Dim 17 oct. 2021 à 20:35
-- Version du serveur :  8.0.21
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bdd_jobboard`
--

-- --------------------------------------------------------

--
-- Structure de la table `advertisements`
--

DROP TABLE IF EXISTS `advertisements`;
CREATE TABLE IF NOT EXISTS `advertisements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `date` datetime NOT NULL,
  `published` tinyint(1) NOT NULL,
  `company_id` int NOT NULL,
  `contract_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `advertisements`
--

INSERT INTO `advertisements` (`id`, `title`, `description`, `date`, `published`, `company_id`, `contract_type`, `salary`, `location`) VALUES
(63, 'Test ad', 'Come work with us', '2021-10-17 22:22:14', 1, 169, 'Intership', '74 000€ per year', 'Toulouse'),
(64, 'company1 ad 2', 'Come work with us !', '2021-10-17 22:23:08', 1, 169, 'Part time', '25 000€ per year', 'Brive'),
(65, 'company2 ad1', 'Come work with us !', '2021-10-17 22:24:00', 1, 170, 'Permanent', '2300€ per month', 'Paris'),
(66, 'company2 ad2', 'Come train with us !', '2021-10-17 22:24:34', 1, 170, 'Internship', '59 000€ per year', 'Marseille'),
(67, 'company3 ad1', 'Come work with us in Paris !', '2021-10-17 22:25:33', 1, 171, 'Permanent', '1 500€ per month', 'Paris'),
(68, 'company4 ad 1', 'Come work with us for some time !', '2021-10-17 22:28:29', 1, 172, 'Temporary - 1 year', '22 000€ per year', 'Bordeaux');

-- --------------------------------------------------------

--
-- Structure de la table `applied`
--

DROP TABLE IF EXISTS `applied`;
CREATE TABLE IF NOT EXISTS `applied` (
  `id` int NOT NULL AUTO_INCREMENT,
  `advertisement_id` int DEFAULT NULL,
  `people_id` int DEFAULT NULL,
  `message` varchar(1500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_people_id` (`people_id`),
  KEY `FK_advertisement_id` (`advertisement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `applied`
--

INSERT INTO `applied` (`id`, `advertisement_id`, `people_id`, `message`, `date`) VALUES
(46, 68, 174, 'Please hire me !', '2021-10-17');

-- --------------------------------------------------------

--
-- Structure de la table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `activities` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `postal_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `city` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `number_employees` int DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `contact_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `siret` varchar(14) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `companies`
--

INSERT INTO `companies` (`id`, `name`, `activities`, `postal_code`, `city`, `number_employees`, `website`, `phone`, `email`, `contact_name`, `siret`, `password`) VALUES
(168, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jerome.seccia@gmail.com', NULL, NULL, '$2a$10$vzrKiDp5mOVxf6FOcHuCoOr.sFVbWB8ZLU6pYm8rcsVLXViM4nMf.'),
(169, 'company1', 'Web developement', '75001', 'Marseille', 12, 'https://company1.com', 65654654, 'company1@mail.fr', 'John Doe', 'XXXXXXXXXXXXXX', '$2a$10$c.TI2uH8nIDlKc0/3RTEnuH5ytAgOiSdMZtm5M1PR3PswUW5hqQHm'),
(170, 'Company2', 'Smithing', '75001', 'Paris', 78, 'https://company2.fr', 6, 'company2@mail.fr', 'Mary Jane', 'XXXXXXXXXXXXXX', '$2a$10$rU0sLGd7fHOjajpiw5lSdelrWzen32v7RZmgqq8z8bcRSJHOKoa4m'),
(171, 'company3', 'Leisure boating', '31000', 'Toulouse', 25, 'https://company3.com', 6, 'company3@mail.fr', 'Peter Parker', 'XXXXXXXXXXXX', '$2a$10$VQ7BJcTYTIlrPmLG.rOYt.K2c2YE1swI0ACm9zOLQEDAgdPe6ZKxW'),
(172, 'Company4', 'Transportation', '64000', 'Castellane', 14, 'https://company4.fr', 6, 'company4@mail.com', 'Clark Kent', 'XXXXXXXXXXXXXX', '$2a$10$3N7gIVkIsGGk482AQMBVSuoi1VhEiWZXgf2RxXtNqMZQF8UYtKpl2'),
(173, 'Company5', 'Gastronomy', '98000', 'Brive', 3, 'https://company5.fr', 6, 'company5@mail.fr', 'Gordon Ramsey', 'XXXXXX', '$2a$10$abSoUWVShRepryV5qrev9ur7J0dfNff1kCGh2iUKreGuFYgwTBkW.');

-- --------------------------------------------------------

--
-- Structure de la table `people`
--

DROP TABLE IF EXISTS `people`;
CREATE TABLE IF NOT EXISTS `people` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `birth_date` datetime DEFAULT NULL,
  `cv` mediumblob,
  `website` varchar(255) DEFAULT NULL,
  `picture` mediumblob,
  `gender` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `people`
--

INSERT INTO `people` (`id`, `email`, `phone`, `name`, `first_name`, `password`, `address`, `postal_code`, `birth_date`, `cv`, `website`, `picture`, `gender`) VALUES
(168, 'jerome.seccia@gmail.com', '0677156976', 'Seccia', 'Jérôme', '$2a$10$6BBbMtbZ2o9btzO2w9ZQyOS6WrxErOOsb62/EWMbvm4SYHk5KDtQK', '6 traverse des loubets', '13011', '1992-04-29 00:00:00', 0x2f70656f706c652f3136382f4ac3a972c3b46d65205365636369612043562e706466, NULL, 0x2f70656f706c652f3136382f4453435f3036383720636f7069652e6a7067, 'male'),
(171, 'candidate1@mail.fr', '06XXXXXXXX', 'Candidate1', 'John', '$2a$10$U1.3VcSM0ZA2wQ46nGIp8uISOt5aBrpufX4w.s6EQ0B73MpU7c9kG', '1 rue du candidat 1', '13001', '1991-09-03 00:00:00', 0x2f70656f706c652f3137312f4376204ac3a972c3b46d65205365636369612e706466, 'https://candidat1.fr', 0x2f70656f706c652f3137312f63616e646964617465312e6a7067, 'male'),
(172, 'candidate2@mail.fr', '', 'Candidate2', 'Marie', '$2a$10$N1Kpzq8R3i4uY98wWo.T9O8fVTJLil/KIuxymUQqUHol2Qa69MxA.', '1 rue du candidat2', '75001', '2001-03-29 00:00:00', 0x2f70656f706c652f3137322f4376204ac3a972c3b46d65205365636369612e706466, 'https://candidat2.fr', 0x2f70656f706c652f3137322f63616e646964617465322e6a7067, 'female'),
(173, 'candidate3@mail.fr', '06XXXXXXXX', 'Candidate3', 'Franck', '$2a$10$m3kZLwb3IvewBtYwPsnZreKgO.X6NYPmM0zI9EmWq.ihis4zftKgW', '1 rue du candidat3', '45000', '1967-05-01 00:00:00', 0x2f70656f706c652f3137332f4376204ac3a972c3b46d65205365636369612e706466, '', 0x2f70656f706c652f3137332f63616e646964617465332e6a7067, 'male'),
(174, 'candidate4@mail.fr', '06XXXXXXX', 'Candidate4', 'Olivia', '$2a$10$O32gKRPZdFpcRLQOVV6lxu3WLA8lI3hNcA0QKxrkmGluKYAAZqkGG', '1 rue du candidat4', '78000', '1998-06-05 00:00:00', 0x2f70656f706c652f3137342f4376204ac3a972c3b46d65205365636369612e706466, '', 0x2f70656f706c652f3137342f63616e646964617465342e6a7067, 'female');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `advertisements`
--
ALTER TABLE `advertisements`
  ADD CONSTRAINT `FK_company_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `applied`
--
ALTER TABLE `applied`
  ADD CONSTRAINT `FK_advertisement_id` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_people_id` FOREIGN KEY (`people_id`) REFERENCES `people` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
