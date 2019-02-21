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

//Globals
var add_item_total = 0;
var add_item_name = "";

//display table function
var displayProducts = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Quantity"],
      colWidths: [5, 30, 30, 8, 12]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
    console.log("------------------------------------------------------".green);
    ask();
  });
};

var finished = function () {
  console.log("\n\nThanks for accessing manager view @ Bamazon!  Have a nice day!\n\n".magenta);
  connection.end();
};

var lowInventory = function () {
  var lowInventoryTable = new Table({
    head: ["ID", "Product", "Department", "Price", "Quantity"],
    colWidths: [5, 30, 30, 8, 12]
  });
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        lowInventoryTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      };
    };
    console.log(lowInventoryTable.toString());
    console.log("------------------------------------------------------".green);
    ask();
  });
};

var inventoryTable = function () {
  var addInventoryTable = new Table({
    head: ["ID", "Product", "Quantity"],
    colWidths: [5, 30, 12]
  });
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      addInventoryTable.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
    };
    console.log(addInventoryTable.toString());
    console.log("------------------------------------------------------".green);
    inventoryAsk();
  });
}

var inventoryAsk = function () {
  inquirer.prompt([{
      type: "input",
      name: "item",
      message: "What item would you like to order more of?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many more?"
    }
  ]).then(function (add) {
    let add_item_id = add.item;
    let add_item_quantity = add.quantity;
    connection.query("SELECT * FROM products WHERE item_id = ?", [add_item_id], function (err, res) {
      add_item_total = parseFloat(add_item_quantity) + parseFloat(res[0].stock_quantity);
      add_item_name = res[0].product_name;
      inventoryAdd(add_item_quantity, add_item_name, add_item_total, add_item_id);
    });
  });
};

var inventoryAdd = function (add_item_quantity, add_item_name, add_item_total, add_item_id) {
  connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [add_item_total, add_item_id], function (err, res) {
    console.log("\nAdded " + add_item_quantity + " " + add_item_name + "(s)\n\n");
    ask();
  });
};

var addProduct = function () {
  inquirer.prompt([{
      type: "input",
      name: "item",
      message: "What item would you like add?"
    },
    {
      type: "input",
      name: "department",
      message: "What department does this belong?"
    },
    {
      type: "input",
      name: "price",
      message: "How much does this cost?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many of this item should we add?"
    }
  ]).then(function (product) {
    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);", [product.item, product.department, product.price, product.quantity], function (err, res) {
      console.log("\n\n-------------------------------------------------\n\n".green);
      ask();
    });
  });
};

var ask = function () {

  inquirer.prompt([

    {
      type: "list",
      name: "command",
      message: "What would you like to buy?  Select by Item #",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Finished"]
    }

  ]).then(function (bamazon) {
    switch (bamazon.command) {
      case "View Products for Sale":
        displayProducts();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        inventoryTable();
        break;

      case "Add New Product":
        addProduct();
        break;

      case "Finished":
        finished();
        break;
    }
  });
};

ask();