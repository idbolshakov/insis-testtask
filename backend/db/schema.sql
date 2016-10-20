--
-- структура базы данных
--

CREATE DATABASE insis_test_task; 

USE insis_test_task;

-- клиенты
CREATE TABLE clients (

    -- ID 
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,

    -- название клиента (имя, наименование и т.п.)
    `name` VARCHAR(255),

    -- тип клиента
    `type` INT NOT NULL
    
    
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- типы клиентов (вспомогательная таблица)
CREATE TABLE clients_types (

    -- ID 
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,

    -- описание типа клиента
    `description` VARCHAR(255) NOT NULL

) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- платежи
CREATE TABLE payments (

    -- ID 
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,

    -- ID клиента
    `client_id` INT NOT NULL,

    -- сумма платежа * 100 (чтобы избежать использования FLOAT типа)
    `summ` INT NOT NULL,

    -- дата платежа (TIMESTAMP)
    `date` INT,

    -- описание платежа
    `description` VARCHAR(255),

    -- ID услуги
    `offer_id` INT NOT NULL,

    -- ID типа платежа
    `payment_type_id` INT NOT NULL

) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- типы платежей
CREATE TABLE payments_types (

    -- ID 
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,

    -- название типа платежа
    `name` VARCHAR(255)


) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- услуги
CREATE TABLE offers (

    -- ID 
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,

    -- название типа услуги
    `name` VARCHAR(255)


) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

