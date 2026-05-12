-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: infoman
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allergy`
--

DROP TABLE IF EXISTS `allergy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allergy` (
  `allergen_Code` char(4) NOT NULL,
  `fk_allergy_patient_ID` int NOT NULL,
  `allergenName` varchar(30) DEFAULT NULL,
  `allergenMed` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`allergen_Code`,`fk_allergy_patient_ID`),
  KEY `fk_patient_ID_idx` (`fk_allergy_patient_ID`),
  CONSTRAINT `fk_allergy_patient_ID` FOREIGN KEY (`fk_allergy_patient_ID`) REFERENCES `patient` (`patient_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `condition`
--

DROP TABLE IF EXISTS `condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condition` (
  `condition_Code` char(4) NOT NULL,
  `fk_condition_patient_ID` int NOT NULL,
  `conditionName` varchar(50) DEFAULT NULL,
  `conditionDiagnosis` date NOT NULL,
  `conditionMed` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`condition_Code`,`fk_condition_patient_ID`,`conditionDiagnosis`),
  KEY `fk_patient_ID_idx` (`fk_condition_patient_ID`),
  CONSTRAINT `fk_condition_patient_ID` FOREIGN KEY (`fk_condition_patient_ID`) REFERENCES `patient` (`patient_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctor_ID` int NOT NULL AUTO_INCREMENT,
  `doctorPDoc` varchar(40) DEFAULT NULL,
  `doctorPNum` varchar(10) DEFAULT NULL,
  `doctorPEmail` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`doctor_ID`),
  UNIQUE KEY `doctorPEmail_UNIQUE` (`doctorPEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_ID` int NOT NULL AUTO_INCREMENT,
  `patientName` varchar(60) NOT NULL,
  `patientAge` int NOT NULL,
  `patientSex` char(1) NOT NULL,
  `patientBday` date NOT NULL,
  `patientRel` varchar(30) NOT NULL,
  `patientMarStat` varchar(30) NOT NULL,
  `patientBType` enum('A+','A-','B+','B-','AB+','AB-','O+','O-','Unkown') DEFAULT NULL,
  `patientHeight` decimal(5,2) NOT NULL,
  `patientWeight` decimal(5,2) NOT NULL,
  `patientPNum` varchar(10) NOT NULL,
  `patientOccup` varchar(30) NOT NULL,
  `fk_doctor_ID` int DEFAULT NULL,
  PRIMARY KEY (`patient_ID`),
  UNIQUE KEY `patientPNum_UNIQUE` (`patientPNum`),
  KEY `fk_doctor_ID_idx` (`fk_doctor_ID`),
  CONSTRAINT `fk_doctor_ID` FOREIGN KEY (`fk_doctor_ID`) REFERENCES `doctor` (`doctor_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patientacc`
--

DROP TABLE IF EXISTS `patientacc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patientacc` (
  `account_ID` int NOT NULL AUTO_INCREMENT,
  `patientEmail` varchar(40) NOT NULL,
  `patientPass` varchar(255) NOT NULL,
  `fk_patient_ID` int DEFAULT NULL,
  PRIMARY KEY (`account_ID`),
  UNIQUE KEY `patientEmail_UNIQUE` (`patientEmail`),
  KEY `fk_patient` (`fk_patient_ID`),
  CONSTRAINT `fk_patient` FOREIGN KEY (`fk_patient_ID`) REFERENCES `patient` (`patient_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `surgery`
--

DROP TABLE IF EXISTS `surgery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgery` (
  `surgery_Code` char(4) NOT NULL,
  `fk_surgery_patient_ID` int NOT NULL,
  `surgeryLoc` varchar(30) DEFAULT NULL,
  `surgeryName` varchar(40) DEFAULT NULL,
  `surgeryDate` date NOT NULL,
  PRIMARY KEY (`surgery_Code`,`fk_surgery_patient_ID`,`surgeryDate`),
  KEY `fk_surgery_patient_ID_idx` (`fk_surgery_patient_ID`),
  CONSTRAINT `fk_surgery_patient_ID` FOREIGN KEY (`fk_surgery_patient_ID`) REFERENCES `patient` (`patient_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-13  0:48:25
