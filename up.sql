CREATE DATABASE IF NOT EXISTS fastcash;

CREATE TABLE fc_user (
	user_id						VARCHAR(255)		NOT NULL	PRIMARY KEY,
	credits						INT							NOT NULL 	DEFAULT 	0,
	is_lender					BOOL						NOT NULL	DEFAULT 	FALSE,
	created_at				TIMESTAMP 			NOT NULL	DEFAULT		CURRENT_TIMESTAMP()
);

CREATE TABLE loan_status (
	id								INT							AUTO_INCREMENT,
	title							VARCHAR(50)			NOT NULL,
	
	PRIMARY KEY (id)
);

CREATE TABLE transaction_status (
	id								INT							AUTO_INCREMENT,
	title							VARCHAR(50)			NOT NULL,
	
	PRIMARY KEY (id)
);

CREATE TABLE loans (
	id								INT							AUTO_INCREMENT,
	user_id						VARCHAR(255)		NOT NULL,
	loan_amount				DECIMAL					NOT NULL,
	loan_status				INT							NOT NULL	DEFAULT	1,
	loaned_by					VARCHAR(255),
	payment_duration	INT,
	due_date					TIMESTAMP,
	interest					INT							DEFAULT	15,
	
	PRIMARY KEY (id)
);

CREATE TABLE transaction_history (
	id									INT							AUTO_INCREMENT,
	transaction_status	INT							NOT NULL 	DEFAULT 1,
	amount							INT							NOT NULL,
	source_account			VARCHAR(100)		NOT NULL,
	dest_account				VARCHAR(100)		NOT NULL,
	created_at					TIMESTAMP				NOT NULL	DEFAULT	CURRENT_TIMESTAMP(),
	
	PRIMARY KEY (id)
);

INSERT INTO loan_status (title)
VALUES
('Open'),
('Offered'),
('Rejected');

INSERT INTO transaction_status (title)
VALUES
('Pending'),
('Success'),
('Failed');
