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
  password: "password",
  database: "bamazon"
});

//display table function
var displayProducts = function () {
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
    ask();
  });
  // connection.end();
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
    var endingString = "";
    if (bamazon.quantity > 1) {
      endingString = "s.";
    } else {
      endingString = ".";
    }
    console.log("\n-------------------------------------\n\n".green);
    console.log("You just purchased " + bamazon.quantity + " " + bamazon.item + endingString);
    console.log("\n\n-----------------------------------".green);
    //adjust in mySQL
    inquirer.prompt([
      {
        type: "list",
        name: "done",
        message: "Did you want to buy anything else?",
        choices: ["Yes", "No"]
      }
    ]).then(function(done){
      console.log(done.done);
      if(done.done === "Yes"){
        displayProducts();
      } else {
        console.log("\n\nThanks for shopping at Bamazon!  Have a nice day!\n\n".magenta);
        connection.end();
      }
    });
  });
};

displayProducts();