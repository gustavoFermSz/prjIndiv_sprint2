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
		CONSTRAINT ch_arroba_usuario CHECK (arroba LIKE '@%'),
    email VARCHAR(60) NOT NULL UNIQUE,
		CONSTRAINT ch_email_usuario CHECK (email LIKE '%@%.%'),
    senha VARCHAR(60) NOT NULL,
    tipoConta TINYINT DEFAULT 2 NOT NULL, -- sendo 1 para contas administrativas no sistema e 2 para contas padrão
		CONSTRAINT ch_tipo_conta CHECK (tipoConta IN (1, 2)),
	dtRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM usuario;


-- TRECHO DE SCRIPT PARCIALMENTE GERADO PELA IA, COM BASE NA MODELAGEM, ABAIXO:
-- Cartas:
CREATE TABLE carta (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(45) NOT NULL,
	imagem MEDIUMBLOB NOT NULL,
	mimeImagem VARCHAR(100) NOT NULL,
    
    tipoCarta VARCHAR(45) NOT NULL,
		CHECK (tipoCarta IN('Líder', 'Herói', 'Comum')),
	nivelForca TINYINT NOT NULL,
		CHECK (nivelForca BETWEEN 0 AND 15),
	zonaCampo VARCHAR(25) NOT NULL,
		CHECK (zonaCampo IN('Vanguarda', 'Longo Alcance', 'Cerco')),
	especialidade VARCHAR(25) NULL,
	tipoMundoFiccional VARCHAR(45) NOT NULL,
		CHECK (tipoMundoFiccional IN ('Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro')),
        
	usuario_id INT NOT NULL,
	dtConfeccao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Quizzes:
CREATE TABLE quiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(60) NOT NULL,
	dtCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	imagemTema MEDIUMBLOB NULL,
	mimeImagem VARCHAR(100) NULL,
	nivelDificuldade VARCHAR(25) NOT NULL,
		CHECK (nivelDificuldade IN ('Fácil', 'Médio', 'Difícil')),
	tipoMundoFiccional VARCHAR(45) NOT NULL,
		CHECK (tipoMundoFiccional IN ('Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro')),
	sinopse VARCHAR(100) NULL,
	usuario_id INT NOT NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);



CREATE TABLE questaoQuiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	pergunta VARCHAR(200) NOT NULL, -- enunciado, né
	imagemFundo MEDIUMBLOB NULL,
	mimeImagem VARCHAR(100) NULL,
	quiz_id INT NOT NULL,
	FOREIGN KEY (quiz_id) REFERENCES quiz(id),
    
    CONSTRAINT uq_quiz_questao
		UNIQUE (id, quiz_id)
);

CREATE TABLE alternativa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	texto VARCHAR(100) NOT NULL,
	correta TINYINT NOT NULL DEFAULT 0,
		CHECK (correta IN(0, 1)),
	
    questaoQuiz_id INT NOT NULL,
	FOREIGN KEY (questaoQuiz_id) REFERENCES questaoQuiz(id),
    
    CONSTRAINT uq_alternativa_questao
	UNIQUE (id, questaoQuiz_id)
);

-- Tentativas / Registros de respostas
CREATE TABLE tentativaQuiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
	usuario_id INT NOT NULL,
	quiz_id INT NOT NULL,
    
    FOREIGN KEY (quiz_id) REFERENCES quiz(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    
    CONSTRAINT uq_tentativa_quiz
	UNIQUE (id, quiz_id),
    
	inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fimTentativa DATETIME NULL,
		CONSTRAINT ch_tempo_tentativa CHECK (fimTentativa IS NULL OR fimTentativa >= inicio),
        
	pontuacao TINYINT NULL DEFAULT 0,
		CONSTRAINT ch_pontuacao CHECK (pontuacao BETWEEN 0 AND 10)
);

CREATE TABLE registro_assinalacoes ( -- entidade fraca que tem FK de outra entidade faca deve fazer uso das FKs que a entidade fraca "importada" possui, mas nesse caso é melhor não tornar tudo isso PK
	id INT PRIMARY KEY AUTO_INCREMENT,
	tentativa_id INT NOT NULL,
	alternativa_id INT NOT NULL,
	questaoQuiz_id INT NOT NULL,
    
    FOREIGN KEY (tentativa_id) REFERENCES tentativaQuiz(id),
    FOREIGN KEY (alternativa_id, questaoQuiz_id) REFERENCES alternativa(id, questaoQuiz_id),
    
    UNIQUE (tentativa_id, questaoQuiz_id),
    -- PRIMARY KEY (id, tentativa_id, alternativa_id),
	criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- publicações

CREATE TABLE publicacao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(75) NOT NULL,
	momentoCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	imgCapa MEDIUMBLOB NOT NULL,
	mimeCapa VARCHAR(100) NOT NULL,
	usuario_id INT NOT NULL,
	tipoMundoFiccional VARCHAR(45) NOT NULL,
		CHECK (tipoMundoFiccional IN ('Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro')),
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE paragrafoPublicacao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	publicacao_id INT NOT NULL,
	numeroNaOrdem INT NOT NULL,
    CONSTRAINT ch_numero_ordem CHECK (numeroNaOrdem BETWEEN 1 AND 6),
    UNIQUE (publicacao_id, numeroNaOrdem),
    
	subtitulo VARCHAR(45) NULL,
	conteudo VARCHAR(500) NOT NULL, -- quantidade de caracteres escolhida ao acaso
	imgParagrafo MEDIUMBLOB NULL,
	mimeImg VARCHAR(100) NULL,
    
	FOREIGN KEY (publicacao_id) REFERENCES publicacao(id)
    -- , PRIMARY KEY (id, publicacao_id)
);
-- Reacoes:
CREATE TABLE reacaoPublicacao (
	publicacao_id INT NOT NULL,
		FOREIGN KEY (publicacao_id) REFERENCES publicacao(id),
	usuario_id INT NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuario(id),
        
	tipoReacao VARCHAR(25) NOT NULL, -- 'like' ou 'dislike'
		CONSTRAINT ch_tipo_reacao CHECK (tipoReacao IN ('like', 'dislike')),
	dataReacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	PRIMARY KEY (publicacao_id, usuario_id)
);



USE fantasia;

SHOW TABLES;


SELECT * FROM usuario;

/*
DROP TABLE carta;
DROP TABLE alternativa;
DROP TABLE quiz;
DROP TABLE questaoquiz;
DROP TABLE tentativaquiz;
DROP TABLE registro_assinalacoes;
DROP TABLE publicacao;
DROP TABLE paragrafopublicacao;
DROP TABLE reacacaopublicacao;
DROP TABLE usuario;

/ 
	PARTE DO WEB-DATA-VIZ ORIGINAL, IRRELEVANTE PARA O SISTEMA FICSIETE

/* em nossa regra de negócio, um aquario tem apenas um sensor *
CREATE TABLE aquario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	descricao VARCHAR(300)
);

-- DROP TABLE aquario;
-- DROP TABLE medida;
SELECT * FROM aquario;
SELECT * FROM medida;

esta tabela deve estar de acordo com o que está em INSERT de sua API do arduino - dat-acqu-ino 

CREATE TABLE medida (
	id INT PRIMARY KEY AUTO_INCREMENT,
	temperatura DECIMAL,
	momento DATETIME,
	fk_aquario INT,
	FOREIGN KEY (fk_aquario) REFERENCES aquario(id)
);


CREATE TABLE aviso (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	descricao VARCHAR(150),
	fk_usuario INT,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);
*/







