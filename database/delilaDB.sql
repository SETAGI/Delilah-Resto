DROP DATABASE IF EXISTS delilahdb;
CREATE DATABASE delilahdb;

USE delilahdb;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (32) NOT NULL,
  full_name VARCHAR (32) NOT NULL,
  email VARCHAR (32) NOT NULL,
  phone VARCHAR (32) NOT NULL,
  shipping_address VARCHAR (120) NOT NULL,
  password VARCHAR (32) NOT NULL,
  es_admin BOOLEAN DEFAULT FALSE,
  creation_date TIMESTAMP on update CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products
(
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  description VARCHAR(120) NOT NULL,
  photo_url VARCHAR(60) NOT NULL,
  price FLOAT NOT NULL,
  creation_date TIMESTAMP on update CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  available BOOLEAN DEFAULT TRUE
); 

CREATE TABLE orders
(
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY FK_user(user_id) REFERENCES users(user_id),
  total FLOAT NOT NULL,
  status VARCHAR (20) NOT NULL DEFAULT 'NUEVO',
  payment_method VARCHAR (20) NOT NULL,
  creation_date TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders_products
(
  order_product_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL, 
  FOREIGN KEY FK_order(order_id) REFERENCES orders(order_id),
  FOREIGN KEY FK_product(product_id) REFERENCES products(product_id)
);