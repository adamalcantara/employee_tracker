USE employeesDB;

INSERT INTO department (name)
VALUES ("Developer"), ("Sales"), ("Legal"), ("Management"), ("Advertising");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior", 200000, 1),("Junior", 60000, 2),("Lawyer", 150000, 3),("Manager", 100000, 4),("Graphic Design", 60000, 5),("Receptionist", 30000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Adam", "Alcantara", 1, NULL),("Valerie", "Pierson", 2, NULL),("Mark", "Johnson", 3, NULL),("Larry", "Davis", 4, NULL);

