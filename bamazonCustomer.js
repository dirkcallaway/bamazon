//Required Node Modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");
var Table = require("cli-table");

//Variable
var product_id;
var productName;

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
var displayProducts = function (callback) {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    var table = new Table({
      head: ["ID", "Product", "Department", "Price"],
      colWidths: [5, 30, 30, 8]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
    }
    console.log(table.toString());
    console.log("------------------------------------------------------".green);
    callback();
  });
  // connection.end();
};

var finishedShopping = function () {
  inquirer.prompt([{
    type: "list",
    name: "done",
    message: "Did you want to buy anything else?",
    choices: ["Yes", "No"]
  }]).then(function (done) {
    console.log(done.done);
    if (done.done === "Yes") {
      displayProducts(ask);
    } else {
      console.log("\n\nThanks for shopping at Bamazon!  Have a nice day!\n\n".magenta);
      connection.end();
    }
  });
};

var adjustProducts = function (quantity, purchased, price) {
  let total_cost = parseFloat(purchased) * parseFloat(price);
  let remainingInventory = quantity - purchased;
  if (remainingInventory < 0) {
    console.log("We currently do not have enough in stock.\n")
    finishedShopping();
  } else {
    connection.query("UPDATE products SET stock_quantity = ? WHERE ?", [remainingInventory, {
      item_id: product_id
    }], function (err, res) {
      if (err) throw err;
      console.log("\n-------------------------------------\n\n".green);
      console.log("You just purchased " + purchased + " " + productName + "(s)");
      console.log("The total cost is $" + total_cost);
      console.log("\n\n-----------------------------------".green);
      finishedShopping();
    });
  }
};

var ask = function () {

  inquirer.prompt([

    {
      type: "input",
      name: "item",
      message: "What would you like to buy?  Select by Item #",
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like?",
    }

  ]).then(function (bamazon) {
    product_id = bamazon.item;
    if (bamazon.quantity > 1) {
      endingString = "s.";
    } else {
      endingString = ".";
    };
    connection.query("SELECT product_name, stock_quantity, price FROM products WHERE ?", {
      item_id: bamazon.item
    }, function (err, res) {
      if (err) throw err;
      productName = res[0].product_name;
      adjustProducts(res[0].stock_quantity, bamazon.quantity, res[0].price);
    });
  });
};

displayProducts(ask);