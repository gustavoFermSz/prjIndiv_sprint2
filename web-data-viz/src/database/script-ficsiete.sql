CREATE DATABASE fantasia;

USE fantasia;

SHOW TABLES;
-- DROP TABLE usuario;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    imgAvatar MEDIUMBLOB NOT NULL,
    mimeAvatar VARCHAR(100),
    arroba varchar(45) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    tipoConta TINYINT DEFAULT 2 NOT NULL, -- sendo 1 para contas administrativas no sistema e 2 para contas padrão
		CONSTRAINT ch_tipo_conta CHECK (tipoConta = 1 OR 2)
);

CREATE TABLE aviso (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	descricao VARCHAR(150),
	fk_usuario INT,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

SELECT * FROM aquario;
SELECT * FROM medida;

CREATE TABLE aquario (
/* em nossa regra de negócio, um aquario tem apenas um sensor */
	id INT PRIMARY KEY AUTO_INCREMENT,
	descricao VARCHAR(300)
);

-- DROP TABLE aquario;
-- DROP TABLE medida;
/* esta tabela deve estar de acordo com o que está em INSERT de sua API do arduino - dat-acqu-ino */

CREATE TABLE medida (
	id INT PRIMARY KEY AUTO_INCREMENT,
	temperatura DECIMAL,
	momento DATETIME,
	fk_aquario INT,
	FOREIGN KEY (fk_aquario) REFERENCES aquario(id)
);

SELECT * FROM usuario;