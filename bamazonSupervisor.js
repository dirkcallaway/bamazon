//Required Node Modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table");
require("dotenv").config();

//mySQL connection info
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "BeckettEv1&Min@",
  database: "bamazon"
});

var finished = function () {
  console.log("\n\nThanks for accessing Supervisor View @ Bamazon!  Have a nice day!\n\n".magenta);
  connection.end();
};

var sales_by_department = function () {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_id ORDER BY departments.department_id", function (err, res) {
    var salesTable = new Table({
      head: ["Deparment ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
      colWidths: [15, 24, 24, 24, 15]
    });
    for (var i = 0; i < res.length; i++) {
        var total_sales = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs);
        salesTable.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, total_sales]);
    };
    console.log(salesTable.toString());
    console.log("------------------------------------------------------".green);
    ask();
  });
}

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

        break;

      case "Finished":
        finished();
        break;
    }
  });
};

ask();