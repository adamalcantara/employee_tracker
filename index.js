const inquirer = require("inquirer");
const mysql = require("mysql");

//Create connection to mysql
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

//Main menu function, called automatically, asks people what they want to do
const menu = () => {
  inquirer
    .prompt([
      {
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Employees', 'View Departments', 'View Roles', 'Add Role', 'Add Department', 'Add Employee', 'Update Employee Roles', 'Exit']
      },
    ])
    .then((answer) => {
      console.log(answer.options)
      switch (answer.options) {
        case 'View Employees':
          viewEmployees();
          break;

        case 'View Departments':
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
        
        case 'Exit':
          console.log(`Thank you very much.`);
          connection.end();
      }
    });
};

//Function to view the employees
const viewEmployees = () => {
  connection.query('SELECT * FROM employee', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

//Function to view the departments
const viewDepartment = () => {
  connection.query('SELECT name FROM department', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

//Function to view the roles
const viewRole = () => {
  connection.query('SELECT id, title, salary, department_id FROM role', (err, data) => {
    if (err) throw err;
    console.table(data);
    menu();
  })
}

//Function to add a role to the roles table
const addRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the role's title.",
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the role's salary.",
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
      {
        type: "list",
        name: "department",
        message: "Please choose what department the role is from.",
        choices: getDepartment()
      },
    ]).then(function (answer) {
      let deptId = getDepartment().indexOf(answer.department) + 1;
      let newRole = { title: answer.title, salary: answer.salary, department_id: deptId }
      connection.query("INSERT INTO role SET ?", newRole, function (err, data) {
        if (err) throw err;
        viewRole();
      });

    });

  });

}

//Function to add a new department to the department table
const addDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    inquirer.prompt([
      {
        type: "input",
        name: "deptname",
        message: "What would you like the name of the department to be?",
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
    ]).then(function (answer) {
      let newDept = { name: answer.deptname }
      connection.query("INSERT INTO department SET ?", newDept, function (err, data) {
        if (err) throw err;
        viewDepartment();
      });
    });
  });
}

//Function to add a new employee to the employee table
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
        choices() {
          const choiceArray = [];
          res.forEach(({ first_name, last_name, id }) => {
            if (id !== "NULL") {
            choiceArray.push({name: first_name + " " + last_name, value: id});
            }
            else console.log(`${first_name} has an ID = Null`)
          });
          return choiceArray;
        },
      },
      {
        type: "list",
        name: "role",
        message: "What shall the employee's role be?",
        choices: getRole()
      },
    ]).then(function (answer) {
      let roleId = getRole().indexOf(answer.role) + 1;
      let newEmp = { first_name: answer.firstname, last_name: answer.lastname, manager_id: answer.manager, role_id: roleId }
      connection.query("INSERT INTO employee SET ?", newEmp, function (err, data) {
        if (err) throw err;
        viewEmployees();
      });

    });

  });

}

//Function to update the role of an employee in the employee table
const updateRole = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer. prompt ([
      {
        type: "list",
        name: "empUpdate",
        message: "Which employee's role would you like to update?",
        choices() {
          const choiceArray = [];
          res.forEach(({ first_name, last_name, id }) => {
            choiceArray.push({name: first_name + " " + last_name, value: id});
          });
          return choiceArray;
        },
      },
      {
        type: "list",
        name: "newRole",
        message: "Which role would you like to assign to this employee?",
        choices: getUpRole()
      },
    ]).then(function (answer) {
      console.log(answer.newRole);
      console.log(answer.empUpdate);
      connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.newRole, answer.empupdate])
      .then (viewEmployees())
    });
  
  })
}

//Array for roles
let rolesArray = [];

//Get the information from the roles table and pass it into the function above
const getRole = () => {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw (err)
    for (let i =0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
  })
  return rolesArray;
}

let updatedRolesArray = [];

const getUpRole = () => {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw (err)
    res.forEach(({ title, id }) => {
      updatedRolesArray.push({name: title, value: id});
    });
  })
  return updatedRolesArray;
}


//Array for departments
let departmentArray = [];

//Get the information from the department table and pass it into the function above
const getDepartment = () => {
  connection.query('SELECT * FROM department', function (err, res) {
    if (err) throw (err)
    for (let i = 0; i < res.length; i++) {
      departmentArray.push(res[i].name);
    }
  })
  return departmentArray;
}

