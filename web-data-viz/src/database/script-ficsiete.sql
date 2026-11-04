CREATE DATABASE fantasia;

USE fantasia;

SHOW TABLES;


CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fotoAvatar MEDIUMBLOB,
    arroba varchar(45),
    email VARCHAR(45),
    senha VARCHAR(60),
    tipoConta TINYINT
		CONSTRAINT ch_tipo_conta CHECK (tipoConta = 1 OR 2)
);

SELECT * FROM usuario;