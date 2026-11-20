CREATE DATABASE fantasia;

USE fantasia;

SHOW TABLES;
SHOW DATABASES;
-- DROP TABLE usuario;

DESC usuario;
SHOW INDEX FROM usuario;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    imgAvatar MEDIUMBLOB NOT NULL,
    mimeAvatar VARCHAR(100) NOT NULL,
    arroba varchar(60) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    tipoConta TINYINT DEFAULT 2 NOT NULL, -- sendo 1 para contas administrativas no sistema e 2 para contas padrão
		CONSTRAINT ch_tipo_conta CHECK (tipoConta IN (1, 2))
);

CREATE TABLE aviso (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	descricao VARCHAR(150),
	fk_usuario INT,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

-- TRECHO DE SCRIPT GERADO PELA IA ABAIXO:
-- publicações

CREATE TABLE publicacao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100) NOT NULL,
	momentoCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	imgCapa MEDIUMBLOB NULL,
	mimeCapa VARCHAR(100) NULL,
	usuario_id INT NOT NULL,
	tipoMundoFiccional VARCHAR(60) NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE paragrafoPublicacao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	publicacao_id INT NOT NULL,
	numeroNaOrdem INT NOT NULL,
	conteudo TEXT,
	imgParagrafo MEDIUMBLOB NULL,
	mimeImg VARCHAR(100) NULL,
	FOREIGN KEY (publicacao_id) REFERENCES publicacao(id)
);

-- Cartas:
CREATE TABLE carta (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	imagem MEDIUMBLOB NULL,
	mimeImagem VARCHAR(100) NULL,
	nivelForca TINYINT NULL,
	zonaCampo VARCHAR(50) NULL,
	especialidade VARCHAR(50) NULL,
	tipoMundoFiccional VARCHAR(60),
	usuario_id INT,
	dtConfeccao DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Quizzes:
CREATE TABLE quiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	dtCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	imagemTema MEDIUMBLOB NULL,
	mimeImagem VARCHAR(100) NULL,
	nivelDificuldade VARCHAR(25),
	tipoMundoFiccional VARCHAR(60),
	sinopse VARCHAR(300),
	usuario_id INT,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);



CREATE TABLE questaoQuiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	pergunta VARCHAR(300),
	imagemFundo MEDIUMBLOB NULL,
	mimeImagem VARCHAR(100) NULL,
	quiz_id INT,
	FOREIGN KEY (quiz_id) REFERENCES quiz(id)
);

CREATE TABLE alternativa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	texto VARCHAR(300),
	correta TINYINT(1) NOT NULL DEFAULT 0,
	questaoQuiz_id INT,
	FOREIGN KEY (questaoQuiz_id) REFERENCES questaoQuiz(id)
);

-- Tentativas / Registros de respostas (planejado; não implementado em controllers ainda)
CREATE TABLE tentativaQuiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	usuario_id INT,
	quiz_id INT,
	inicio DATETIME,
	fimTentativa DATETIME NULL,
	pontuacao INT NULL
);

CREATE TABLE registro_assinalacoes (
	id INT PRIMARY KEY AUTO_INCREMENT,
	tentativa_id INT REFERENCES tentativaQuiz(id),
	questao_id INT REFERENCES questaoQuiz(id),
	alternativa_id INT REFERENCES alternativa(id),
	criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Reacoes:
CREATE TABLE reacacaoPublicacao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	publicacao_id INT,
	usuario_id INT,
	tipoReacao VARCHAR(25), -- 'like' ou 'dislike'
	dataReacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (publicacao_id, usuario_id)
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

USE fantasia;

SELECT * FROM usuario;





































