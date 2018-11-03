DROP DATABASE IF EXISTS noteTaker_db;
CREATE DATABASE noteTaker_db;
USE noteTaker_db;

-- Create the Note Taker table
CREATE TABLE notes
(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR (255) NOT NULL,
  note VARCHAR (255) NOT NULL,
  PRIMARY KEY(id)
);
