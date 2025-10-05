CREATE DATABASE IF NOT EXISTS verifypro;
USE verifypro;


CREATE TABLE IF NOT EXISTS employees (
id INT AUTO_INCREMENT PRIMARY KEY,
uid VARCHAR(20) UNIQUE NOT NULL,
full_name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE,
password VARCHAR(255),
date_of_birth DATE,
address TEXT,
verification_status ENUM('none','pending','verified','rejected') DEFAULT 'none',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS documents (
id INT AUTO_INCREMENT PRIMARY KEY,
employee_id INT NOT NULL,
type ENUM('selfie','cnicFront','cnicBack') NOT NULL,
file_path VARCHAR(500) NOT NULL,
uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS work_history (
id INT AUTO_INCREMENT PRIMARY KEY,
employee_id INT NOT NULL,
company VARCHAR(255),
position VARCHAR(255),
start_date DATE,
end_date DATE,
description TEXT,
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);


-- Optional: seed an admin employee for testing
INSERT IGNORE INTO employees (uid, full_name, email, password, verification_status) VALUES ('EMP000000','Admin','admin@example.com','', 'verified');