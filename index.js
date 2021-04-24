const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'HuxleyRoslyn4053!',
    database: 'top_songsDB',
  });

  connection.connect((err) => {
    if (err) throw err;
    menu();
  });

  const menu = () => {
    inquirer
        .prompt([
          {
            name: 'options',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Employees','View Employees by Department', 'View Employees by Manager', 'Add Role', 'Add Department', 'Add Employee', 'Update Employee Roles']
          },
        ])
        .then((answer) => {
          console.log(answer.options) 
          switch (answer.options) {
            case 'View Employees':
              viewEmployees();
              break;

            case 'View Employees by Department':
              viewDepartment();
              break;

            case 'View Employees by Manager':
              viewManager();
              break;

            case 'Add Role':
              addRole();
              break;

            case 'Add Department':
              addDepartment();
              break;

            case 'Add Employee':
              addEmployee();
              break;

            case 'Update Employee Roles':
              updateRole();
              break;
          }
        });
  };

