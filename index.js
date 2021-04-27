const inquirer = require("inquirer");
const mysql = require("mysql");

//Create connection to mysql
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  //Password
  password: 'HuxleyRoslyn4053!',

  //Database
  database: 'employeesDB',
});

//Establish a connection, check for an error, and run the menu function
connection.connect((err) => {
  if (err) throw err;
  menu();
});

//Main menu function, called automatically, asks people what they want to do
const menu = () => {
  //Start inquirer
  inquirer
    .prompt([
      //initial question
      {
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Employees', 'View Departments', 'View Roles', 'View Employees by Manager', 'Add Role', 'Add Department', 'Add Employee', 'Update Employee Roles', 'Update Employee Manager', 'Exit']
      },
    ])
    .then((answer) => {
      console.log(answer.options)
      //Call the functions based on which option the user chooses
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

        case 'View Employees by Manager':
          viewByManager();
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

        case 'Update Employee Manager':
          updateEmpMgr();
          break;
        //If the choice is "exit," terminate the connection (while still exhibiting good manners and thanking the user for using the program)
        case 'Exit':
          console.log(`Thank you very much.`);
          connection.end();
      }
    });
};

//Function to view the employees
const viewEmployees = () => {
  //Establish a connection, check for an error
  connection.query('SELECT * FROM employee', (err, data) => {
    if (err) throw err;
    //Print the data in the console as a table
    console.table(data);
    //Call the menu function again so that the options display again
    menu();
  })
}

//Function to view the departments
const viewDepartment = () => {
  //Establish a connection, check for an error
  connection.query('SELECT name FROM department', (err, data) => {
    if (err) throw err;
    //Print the data in the console as a table
    console.table(data);
    //Call the menu function again so that the options display again
    menu();
  })
}

//Function to view the roles
const viewRole = () => {
  //Establish a connection, check for an error
  connection.query('SELECT id, title, salary, department_id FROM role', (err, data) => {
    if (err) throw err;
    //Print the data in the console as a table
    console.table(data);
    //Call the menu function again so that the options display again
    menu();
  })
}

//SELECT * FROM employees WHERE manager_id = ?, [manager_id = null]
const viewByManager = async () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Which manager's employees would you like to view?",
        //Get the options for the manager
        choices() {
          //Empty array for the choices
          const choiceArray = [];
          //Get the first name, last name, and id from the table
          // console.log(res);
          res.forEach(({ first_name, last_name, id, manager_id }) => {
            if (!manager_id) {
              //push the data into the array 
              choiceArray.push({ name: first_name + " " + last_name, value: id });
            }
          });
          return choiceArray;
        },
      },
    ]).then(function (answer){
      connection.query("SELECT * FROM employee WHERE manager_id = ?", [answer.manager], function (err, res){
        if (err) throw (err)
        console.table(res);
        menu();
      })
    }
    )
  })
}

//Function to add a role to the roles table
const addRole = () => {
  //Establish a connection, check for an error
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    //inquirer prompt
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the role's title.",
        //validation to ensure something is entered
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
        //validation to ensure something is entered
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
        //call the get department function in order to get the choices
        choices: getDepartment()
      },
    ]).then(function (answer) {
      //Define an object and get the index of the answer to the department queston, then increment that so that it matches the ID
      let deptId = getDepartment().indexOf(answer.department) + 1;
      //Define an object new role and pass in the answers from the first two questions, and the object defined as deptId
      let newRole = { title: answer.title, salary: answer.salary, department_id: deptId }
      //Insert the data from the newRole object into the role table
      connection.query("INSERT INTO role SET ?", newRole, function (err, data) {
        if (err) throw err;
        //Call the view role function again in order to display the table, and run the menu function again
        viewRole();
      });

    });

  });

}

//Function to add a new department to the department table
const addDepartment = () => {
  //Establish a connection, then check for an error
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    //Print the response from the connection query so that users can see what departments are already there
    console.table(res);
    inquirer.prompt([
      {
        type: "input",
        name: "deptname",
        message: "What would you like the name of the department to be?",
        //Validation
        validate: data => {
          if (data !== "") {
            return true
          }
          return "Please enter a name."
        }
      },
    ]).then(function (answer) {
      //define object and pass in the answers for name
      let newDept = { name: answer.deptname }
      connection.query("INSERT INTO department SET ?", newDept, function (err, data) {
        if (err) throw err;
        //call the view department function so that it displays the table and runs the menu function again
        viewDepartment();
      });
    });
  });
}

//Function to add a new employee to the employee table
const addEmployee = () => {
  //Establish connectoin, check for an error
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
        //Get the options for the manager
        choices() {
          //Empty array for the choices
          const choiceArray = [];
          //Get the first name, last name, and id from the table
          // console.log(res);
          res.forEach(({ first_name, last_name, id, manager_id }) => {
            if (!manager_id) {
              //push the data into the array 
              choiceArray.push({ name: first_name + " " + last_name, value: id });
            }
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
    inquirer.prompt([
      {
        type: "list",
        name: "empUpdate",
        message: "Which employee's role would you like to update?",
        choices() {
          const choiceArray = [];
          res.forEach(({ first_name, last_name, id }) => {
            choiceArray.push({ name: first_name + " " + last_name, value: id });
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
      // console.log(answer.newRole);
      // console.log(answer.empUpdate);
      connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.newRole, answer.empUpdate], function (err, data) {
        if (err) throw err;
        viewEmployees();
      });
    });

  })
}

//Function to update the manager  of an employee in the employee table
const updateEmpMgr = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "empUpdate",
        message: "Which employee's manager would you like to update?",
        choices() {
          const empArray = [];
          res.forEach(({ first_name, last_name, id }) => {
            empArray.push({ name: first_name + " " + last_name, value: id });
          });
          return empArray;
        },
      },
      {
        type: "list",
        name: "mgrUpdate",
        message: "Which manager would you like assign to the seleced employee?",
        choices() {
          const mgrArray = [];
          res.forEach(({ first_name, last_name, id }) => {
            mgrArray.push({ name: first_name + " " + last_name, value: id });
          });
          return mgrArray;
        },
      },
    ]).then(function (answer) {
      // console.log(answer.newRole);
      // console.log(answer.empUpdate);
      connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [answer.mgrUpdate, answer.empUpdate], function (err, data) {
        if (err) throw err;
        viewEmployees();
      });
    });

  })
}


//Array for roles
let rolesArray = [];

//Get the information from the roles table and pass it into the function above
const getRole = () => {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw (err)
    for (let i = 0; i < res.length; i++) {
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
      updatedRolesArray.push({ name: title, value: id });
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