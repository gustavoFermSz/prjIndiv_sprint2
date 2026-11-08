CREATE DATABASE fantasia;

USE fantasia;

SHOW TABLES;


CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    fotoAvatar MEDIUMBLOB NOT NULL,
    mimeAvatar VARCHAR(100) NOT NULL,
    arroba varchar(45) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    tipoConta TINYINT DEFAULT 2 NOT NULL, -- sendo 1 para contas administrativas no sistema e 2 para contas padrão
		CONSTRAINT ch_tipo_conta CHECK (tipoConta = 1 OR 2)
);

SELECT * FROM usuario;