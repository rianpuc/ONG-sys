SET NAMES 'utf8mb4';
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

USE `ong` ;
-- Inserindo Instituições
INSERT INTO `instituicao` (`CNPJ`, `Nome`, `Endereco`) VALUES
('32638826000177', 'Somos do Bhem', 'R. Águas Vermelhas, 79 - Minaslandia');
-- Inserindo Receptores (pessoas que recebem as doações)
INSERT INTO `receptor` (`CPF`, `Nome`, `Endereco`) VALUES
('11122233344', 'João da Silva', 'Rua da Esperança, 10'),
('55566677788', 'Maria Oliveira', 'Beco da Paz, 20'),
('99988877766', 'Carlos Souza', 'Travessa Alegria, 30'),
('10120230344', 'Sandra Neves', 'Rua das Flores, 123'),
('50560670788', 'Pedro Martins', 'Vila dos Pássaros, 45'),
('90980870766', 'Família Lima', 'Avenida Principal, 789');
-- Inserindo Eventos de distribuição
INSERT INTO `evento` (`ID_Evento`, `Local`, `Data`, `Instituicao`) VALUES
(1, 'Praca da Matriz', '2025-07-03', '32638826000177'),
(2, 'Ginasio Municipal', '2025-08-20', '32638826000177'),
(3, 'Centro Comunitário', '2025-06-28', '32638826000177'),
(4, 'Parque Municipal', '2025-09-15', '32638826000177');
-- Inserindo Tipos de Itens que a ONG armazena
INSERT INTO `item` (`ID_Item`, `Nome_Item`, `Tipo_Item`, `Quantidade_Atual`) VALUES
(101, 'Arroz 1kg', 'Alimento', 150),
(102, 'Feijão 1kg', 'Alimento', 120),
(103, 'Cobertor Casal', 'Agasalho', 80),
(104, 'Jaqueta Adulto M', 'Agasalho', 50),
(105, 'Água Sanitária 1L', 'Higiene', 200),
(106, 'Dinheiro', 'Financeiro', 135),
(107, 'Leite em Pó 400g', 'Alimento', 0),
(108, 'Fralda Geriátrica M', 'Higiene', 0),
(109, 'Blusa de Lã Infantil', 'Agasalho', 0);
-- Inserindo Doadores
INSERT INTO `doador` (`ID_Doador`, `CPF`, `CNPJ`, `Nome_Doador`, `Tipo_Doador`) VALUES
(1, '12345678901', NULL, 'Ana Pereira', 'Fisica'),
(2, '98765432109', NULL, 'Roberto Costa', 'Fisica'),
(3, NULL, '01234567000199', 'Supermercado Preço Bom', 'Juridica'),
(4, '44455566677', NULL, 'Camila Borges', 'Fisica'),
(5, '88899900011', NULL, 'Fernando Souza', 'Fisica'),
(6, NULL, '22333444000155', 'Construtora Morar Bem', 'Juridica'),
(7, NULL, '55666777000188', 'Farmácia Saúde Total', 'Juridica');
-- Inserindo Voluntarios
INSERT INTO `voluntario` (`CPF`, `Nome`, `Funcao`, `Instituicao`) VALUES
('33344455566', 'Fernanda Lima', 'Organizador', '32638826000177'),
('77788899900', 'Lucas Martins', 'Motorista', '32638826000177'),
('11122233345', 'Mariana Costa', 'Organizador', '32638826000177'),
('55566677789', 'Bruno Alves', 'Motorista', '32638826000177'),
('99988877767', 'Thiago Mendes', 'Cozinheiro', '32638826000177');
-- Inserindo registros de Doacao
INSERT INTO `doacao` (`ID_Doacao`, `Data`, `Doador`) VALUES
(1001, '2025-06-20', 1), -- Doacao de Ana Pereira
(1002, '2025-06-22', 3), -- Doacao do Supermercado Preço Bom
(1003, '2025-06-25', 2), -- Doacao de Roberto Costa
(1004, '2025-07-02', 4), -- Doacao de Camila Borges
(1005, '2025-07-06', 6), -- Doacao da Construtora
(1006, '2025-07-12', 7); -- Doacao da Farmácia
-- Inserindo registros de Entrega
INSERT INTO `entrega` (`ID_Entrega`, `Data_Entrega`, `Evento`, `Receptor`) VALUES
(2001, '2025-07-03', 1, '11122233344'), -- Entrega para João da Silva no evento da Praça da Matriz
(2002, '2025-07-03', 1, '55566677788'), -- Entrega para Maria Oliveira no evento da Praça da Matriz
(2003, '2025-06-28', 3, '90980870766'), -- Entrega para Família Lima
(2004, '2025-06-28', 3, '10120230344'); -- Entrega para Sandra Neves
-- Itens que foram doados em cada Doacao
-- Doacao 1001 (de Ana Pereira)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(103, 1001, 10), -- 10 Cobertores
(104, 1001, 15); -- 15 Jaquetas
-- Doacao 1002 (do Supermercado)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(101, 1002, 50), -- 50kg de Arroz
(102, 1002, 50); -- 50kg de Feijão
-- Itens da Doação 1003 (Roberto Costa)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(109, 1003, 30), -- 30 Blusas de Lã
(103, 1003, 5);  -- 5 Cobertores
-- Itens da Doação 1004 (Camila Borges)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(107, 1004, 40); -- 40 Latas de Leite em Pó
-- Itens da Doação 1005 (Construtora Morar Bem)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(101, 1005, 100), -- 100kg de Arroz
(102, 1005, 100); -- 100kg de Feijão
-- Itens da Doação 1006 (Farmácia Saúde Total)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(108, 1006, 60), -- 60 pacotes de Fralda
(105, 1006, 50); -- 50L de Água Sanitária
-- Entrega 2001 (para João da Silva)
INSERT INTO `item_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(101, 2001, 2), -- 2kg de Arroz
(102, 2001, 2), -- 2kg de Feijão
(103, 2001, 1); -- 1 Cobertor
-- Entrega 2002 (para Maria Oliveira)
INSERT INTO `item_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(101, 2002, 2), -- 2kg de Arroz
(102, 2002, 1), -- 1kg de Feijão
(104, 2002, 1); -- 1 Jaqueta
-- Itens da Entrega 2003 (para Família Lima)
INSERT INTO `item_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(109, 2003, 3), -- 3 Blusas de Lã
(103, 2003, 1); -- 1 Cobertor
-- Itens da Entrega 2004 (para Sandra Neves)
INSERT INTO `item_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(109, 2004, 2), -- 2 Blusas de Lã
(105, 2004, 1); -- 1L de Água Sanitária

UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 30 WHERE `ID_Item` = 109; -- +30 Blusas de Lã
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 5  WHERE `ID_Item` = 103; -- +5 Cobertores
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 40 WHERE `ID_Item` = 107; -- +40 Leite em Pó
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 100 WHERE `ID_Item` = 101; -- +100kg Arroz
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 100 WHERE `ID_Item` = 102; -- +100kg Feijão
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 60 WHERE `ID_Item` = 108; -- +60 Fraldas
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` + 50 WHERE `ID_Item` = 105; -- +50L Água Sanitária

UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` - 5 WHERE `ID_Item` = 109; -- -5 Blusas de Lã (3+2)
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` - 1 WHERE `ID_Item` = 103; -- -1 Cobertor
UPDATE `item` SET `Quantidade_Atual` = `Quantidade_Atual` - 1 WHERE `ID_Item` = 105; -- -1L Água Sanitária

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
