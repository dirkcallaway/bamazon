# Bamazon - A Node/mySQL Shopping Platform

## Introduction
Bamazon is a store front built on Node.js and mySQL.  The purpose was to use Node to simulate a customer, manager, and supervisor portal into an online shopping experience.  The customer could buy things from the store and the records would be updated in the mySQL database.  The manager could monitor sames and reorder stock.  The supervisor could create new departments and monitor departments for total profits.

## Customer Portal
The customer portal displayed items for sale and their price.  It would calculate the total cost of the items purchased and delete the stock from the mySQL database.  Video demonstration can be seen here:
https://drive.google.com/file/d/12pyIP639Ml6cYOYDFoJk10iaHvDJUtyE/view

## Manager Portal
The manager portal allowed a manager to see what items were currently for sale, displaying the item, department, cost and quantity.  It also allowed the manager to narrow the items down to just those that were low in stock ( < 5 ) to see what needed to be reordered.  The manager could then reorder more stock of an item.  Lastly, a manager could add a new product to a current department.  Video demonstration can be seen here:
https://drive.google.com/file/d/15uQRSLNxS9L0c1EFKdI_po13RQ8oLA3P/view

## Supervisor Portal
The supervisor portal had two functionalities.  The first was to view product sale by department.  This allows the supervisor to see how each department is doing based on their sales and the overhead cost of each department.  This utilizes a mySQL join between the products table and the departments table.  The second functionality was to create a new department.  Once a new department is created, a manager could then add products to it so customers would be able to purchase them.  A video demonstration can be seen here:
https://drive.google.com/file/d/1s68fcsInayeJ1fRWhP3cGRE64wQvbLf_/view
