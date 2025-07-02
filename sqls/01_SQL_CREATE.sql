SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ong
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ong` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ong` ;

-- -----------------------------------------------------
-- Table `ong`.`Doador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Doador` (
  `ID_Doador` INT NOT NULL,
  `CPF` VARCHAR(11),
  `CNPJ` VARCHAR(14),
  `Nome_Doador` VARCHAR(45) NOT NULL,
  `Tipo_Doador` VARCHAR(8) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Doacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Doacao` (
  `ID_Doacao` INT NOT NULL,
  `Data` DATE NOT NULL,
  `Doador` INT)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Entrega` (
  `ID_Entrega` INT NOT NULL,
  `Data_Entrega` DATE NOT NULL,
  `Evento` INT,
  `Receptor` VARCHAR(11) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Evento` (
  `ID_Evento` INT NOT NULL,
  `Local` VARCHAR(45) NOT NULL,
  `Data` DATE NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Instituicao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Instituicao` (
  `CNPJ` VARCHAR(14) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Endereço` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Item` (
  `ID_Item` INT NOT NULL,
  `Nome_Item` VARCHAR(45) NOT NULL,
  `Tipo_Item` VARCHAR(20) NOT NULL,
  `Quantidade_Atual` INT NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item_Da_Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Item_Da_Entrega` (
  `ID_Item` INT NOT NULL,
  `ID_Entrega` INT NOT NULL,
  `Quantidade` INT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item_Doado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Item_Doado` (
  `ID_Item` INT NOT NULL,
  `ID_Doacao` INT NOT NULL,
  `Quantidade` INT NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Receptor` (
  `CPF` VARCHAR(11) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Endereço` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Voluntario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`Voluntario` (
  `CPF` VARCHAR(11) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Funcao` VARCHAR(20) NOT NULL,
  `Instituicao` VARCHAR(14))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
