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
  database: 'employeesDB',
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
        choices: ['View Employees', 'View Employees by Department', 'View Roles', 'Add Role', 'Add Department', 'Add Employee', 'Update Employee Roles']
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

        case 'View Roles':
          viewRole();
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

const viewEmployees = () => {
  connection.query('SELECT * FROM employee', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

const viewDepartment = () => {
  connection.query('SELECT name FROM department', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

const viewRole = () => {
  connection.query('SELECT title, salary FROM role', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

const addEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "firstname",
        message: "Please enter the employee's first name",
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
      {
        type: "input",
        name: "lastname",
        message: "Please enter the employee's last name",
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
      {
        type: "list",
        name: "manager",
        message: "Who shall the employee's manager be?",
        // choices: res.map(res => res.id + " " + res.first_name + " " + res.last_name)
        choices() {
          const choiceArray = [];
          res.forEach(({ first_name }) => {
            choiceArray.push(first_name);
          });
          return choiceArray;
        },
      },
    ]).then(function (answer) {
      //manager id needs to equal get id from table where first name equals answer.manager
      let mgr_id = 'SELECT id FROM employee WHERE '
      let newEmp = { first_name: answer.firstname, last_name: answer.lastname, manager_id: answer.manager, role_id: 1 }
      connection.query("INSERT INTO employee SET ?", newEmp, function (err, data) {
        if (err) throw err;
        console.table(data);
        menu();
      });

    });

  });

}