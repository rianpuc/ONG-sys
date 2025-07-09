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
('99988877766', 'Carlos Souza', 'Travessa Alegria, 30');
-- Inserindo Eventos de distribuição
INSERT INTO `evento` (`ID_Evento`, `Local`, `Data`, `Instituicao`) VALUES
(1, 'Praca da Matriz', '2025-07-15', '32638826000177'),
(2, 'Ginasio Municipal', '2025-08-20', '32638826000177');
-- Inserindo Tipos de Itens que a ONG armazena
INSERT INTO `item` (`ID_Item`, `Nome_Item`, `Tipo_Item`, `Quantidade_Atual`) VALUES
(101, 'Arroz 1kg', 'Alimento', 150),
(102, 'Feijão 1kg', 'Alimento', 120),
(103, 'Cobertor Casal', 'Agasalho', 80),
(104, 'Jaqueta Adulto M', 'Agasalho', 50),
(105, 'Água Sanitária 1L', 'Higiene', 200),
(106, 'Dinheiro', 'Financeiro', 135);
-- Inserindo Doadores Pessoa Fisica
INSERT INTO `doador` (`ID_Doador`, `CPF`, `CNPJ`, `Nome_Doador`, `Tipo_Doador`) VALUES
(1, '12345678901', NULL, 'Ana Pereira', 'Fisica'),
(2, '98765432109', NULL, 'Roberto Costa', 'Fisica');
-- Inserindo Doadores Pessoa Juridica
INSERT INTO `doador` (`ID_Doador`, `CPF`, `CNPJ`, `Nome_Doador`, `Tipo_Doador`) VALUES
(3, NULL, '01234567000199', 'Supermercado Preço Bom', 'Juridica');
-- Inserindo Voluntarios
INSERT INTO `voluntario` (`CPF`, `Nome`, `Funcao`, `Instituicao`) VALUES
('33344455566', 'Fernanda Lima', 'Organizador', '32638826000177'),
('77788899900', 'Lucas Martins', 'Motorista', '32638826000177');
-- Inserindo registros de Doacao
INSERT INTO `doacao` (`ID_Doacao`, `Data`, `Doador`) VALUES
(1001, '2025-06-20', 1), -- Doacao de Ana Pereira
(1002, '2025-06-22', 3); -- Doacao do Supermercado Preço Bom
-- Inserindo registros de Entrega
INSERT INTO `entrega` (`ID_Entrega`, `Data_Entrega`, `Evento`, `Receptor`) VALUES
(2001, '2025-07-15', 1, '11122233344'), -- Entrega para João da Silva no evento da Praça da Matriz
(2002, '2025-07-15', 1, '55566677788'); -- Entrega para Maria Oliveira no evento da Praça da Matriz
-- Itens que foram doados em cada Doacao
-- Doacao 1001 (de Ana Pereira)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(103, 1001, 10), -- 10 Cobertores
(104, 1001, 15); -- 15 Jaquetas
-- Doacao 1002 (do Supermercado)
INSERT INTO `item_doado` (`ID_Item`, `ID_Doacao`, `Quantidade`) VALUES
(101, 1002, 50), -- 50kg de Arroz
(102, 1002, 50); -- 50kg de Feijão
-- Entrega 2001 (para João da Silva)
INSERT INTO `item_da_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(101, 2001, 2), -- 2kg de Arroz
(102, 2001, 2), -- 2kg de Feijão
(103, 2001, 1); -- 1 Cobertor
-- Entrega 2002 (para Maria Oliveira)
INSERT INTO `item_da_entrega` (`ID_Item`, `ID_Entrega`, `Quantidade`) VALUES
(101, 2002, 2), -- 2kg de Arroz
(102, 2002, 1), -- 1kg de Feijão
(104, 2002, 1); -- 1 Jaqueta

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
