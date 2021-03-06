//Required Node Modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table");
require("dotenv").config();

//mySQL connection info
var connection = mysql.createConnection({
  host: process.env.DB_host,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: process.env.DB
});

var finished = function () {
  console.log("\n\nThanks for accessing Supervisor View @ Bamazon!  Have a nice day!\n\n".magenta);
  connection.end();
};

var sales_by_department = function () {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_id ORDER BY departments.department_id", function (err, res) {
    var salesTable = new Table({
      head: ["Deparment ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
      colWidths: [15, 24, 24, 24, 15]
    });
    for (var i = 0; i < res.length; i++) {
      let productSales = res[i].product_sales === null ? 0 : res[i].product_sales;
      var total_sales = parseFloat(productSales) - parseFloat(res[i].over_head_costs);
      salesTable.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, productSales, total_sales]);
    };
    console.log(salesTable.toString());
    console.log("------------------------------------------------------".green);
    ask();
  });
};

var create_new_department = function () {
  inquirer.prompt([{
      type: "input",
      name: "name",
      message: "What department would you like to add?",
    },
    {
      type: "input",
      name: "overhead",
      message: "What's the department's overhead cost?",
    },

  ]).then(function (department) {
    connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES(?, ?);", [department.name, department.overhead], function (err, res) {
      console.log("\n\nAdded department " + department.name + " with overhead of " + department.overhead + "\n\n");
      console.log("------------------------------------------------------".green);
      ask();
    });
  });
};

var ask = function () {

  inquirer.prompt([

    {
      type: "list",
      name: "command",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Finished"]
    }

  ]).then(function (bamazon) {
    switch (bamazon.command) {
      case "View Product Sales by Department":
        sales_by_department();
        break;

      case "Create New Department":
        create_new_department();
        break;

      case "Finished":
        finished();
        break;
    }
  });
};

ask();