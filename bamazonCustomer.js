//Required Node Modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table");

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

//display table function
var displayProducts = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    var table = new Table({
      head:["ID", "Product", "Department", "Price"],
      colWidths: [5,30,30,8]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
      // console.log(res[i].id + " | " + res[i].artist + " | " + res[i].title + " | " + res[i].year);
    }
    console.log(table.toString());
  });
  connection.end();
};

displayProducts();