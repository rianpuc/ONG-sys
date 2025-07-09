SET NAMES 'utf8mb4';
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
CREATE TABLE IF NOT EXISTS `ong`.`doador` (
  `ID_Doador` INT NOT NULL,
  `CPF` VARCHAR(11),
  `CNPJ` VARCHAR(14),
  `Nome_Doador` VARCHAR(45) NOT NULL,
  `Tipo_Doador` VARCHAR(8) NOT NULL,
  `Ativo` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Doacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`doacao` (
  `ID_Doacao` INT NOT NULL,
  `Data` DATE NOT NULL,
  `Doador` INT NOT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`entrega` (
  `ID_Entrega` INT NOT NULL,
  `Data_Entrega` DATE NOT NULL,
  `Evento` INT,
  `Receptor` VARCHAR(11) NOT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`evento` (
  `ID_Evento` INT NOT NULL,
  `Local` VARCHAR(45) NOT NULL,
  `Data` DATE NOT NULL,
  `Instituicao` VARCHAR(14) NOT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Instituicao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`instituicao` (
  `CNPJ` VARCHAR(14) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Endereco` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`item` (
  `ID_Item` INT NOT NULL,
  `Nome_Item` VARCHAR(45) NOT NULL,
  `Tipo_Item` VARCHAR(20) NOT NULL,
  `Quantidade_Atual` INT NOT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item_Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`item_entrega` (
  `ID_Item` INT NOT NULL,
  `ID_Entrega` INT NOT NULL,
  `Quantidade` INT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Item_Doado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`item_doado` (
  `ID_Item` INT NOT NULL,
  `ID_Doacao` INT NOT NULL,
  `Quantidade` INT NOT NULL,
  `Status` BOOLEAN NOT NULL DEFAULT TRUE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`receptor` (
  `CPF` VARCHAR(11) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Endereco` VARCHAR(45) NOT NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ong`.`Voluntario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ong`.`voluntario` (
  `CPF` VARCHAR(11) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Funcao` VARCHAR(20) NOT NULL,
  `Instituicao` VARCHAR(14) NOT NULL)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
