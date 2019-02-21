DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price INTEGER(5) NOT NULL,
stock_quantity INTEGER(11) NOT NULL,
product_sales INTEGER DEFAULT 0,
PRIMARY KEY(item_id)
);

CREATE TABLE departments(
department_id INTEGER NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NOT NULL,
over_head_costs INTEGER(5) NOT NULL,
PRIMARY KEY(department_id)
);