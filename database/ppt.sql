SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Vendors;
DROP TABLE IF EXISTS Parts;
DROP TABLE IF EXISTS Assemblies;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Assembly_parts;
DROP TABLE IF EXISTS Order_parts;
SET FOREIGN_KEY_CHECKS = 1;

-- 
-- Table structure for Vendors
--

CREATE TABLE Vendors (
vendor_id int(11) NOT NULL AUTO_INCREMENT,
vendor_name varchar(255) NOT NULL,
PRIMARY KEY (vendor_id),
UNIQUE (vendor_name)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Vendors
--

LOCK TABLES Vendors WRITE;
INSERT INTO Vendors VALUES 
(1, 'McMaster-Carr'), 
(2, 'Dodge'), 
(3, 'Fastenal');
UNLOCK TABLES;

-- 
-- Table structure for Parts
--

CREATE TABLE Parts (
part_id int(11) NOT NULL AUTO_INCREMENT,
vendor_id int(11),
vendor_num varchar(255),
part_name varchar(255) NOT NULL,
inventory_quantity int(11) DEFAULT 0 CHECK (inventory_quantity >= 0),
PRIMARY KEY (part_id),
CONSTRAINT FK_Vendor_ID FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id),
UNIQUE (vendor_num, part_name)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Parts
--

LOCK TABLES Parts WRITE;
INSERT INTO Parts VALUES
(6043, 1,  '91375A535', '.25-20x.375" Set Screw', 3), 
(6057, 2, 'P2BSXR203', 'Pillow Block Bearing 2.1875 ID', 0), 
(6063, 3, '35021', '½"  dia x 8-⅛" Weld Stud Concrete Anchor', 500);
UNLOCK TABLES;

-- 
-- Table structure for Assemblies
--

CREATE TABLE Assemblies (
assembly_id int(11) NOT NULL AUTO_INCREMENT,
assembly_num varchar(255) NOT NULL CHECK (assembly_num LIKE '__-___-___%'),
assem_name varchar(255),
PRIMARY KEY (assembly_id),
UNIQUE (assembly_num)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Assemblies
--

LOCK TABLES Assemblies WRITE;
INSERT INTO Assemblies VALUES
(1, 'BN-100-402', 'Gravity Surge Bin'), 
(2, 'DC-000-100', 'Infeed Drag Conveyor'), 
(3, 'SP-746-200', 'Bulk Spout');
UNLOCK TABLES;

-- 
-- Table structure for Employees
--

CREATE TABLE Employees (
employee_id int(9) NOT NULL AUTO_INCREMENT,
first_name varchar(255) NOT NULL,
last_name varchar(255) NOT NULL,
email varchar(255),
position varchar(255),
PRIMARY KEY (employee_id),
UNIQUE (email)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Employees
--

LOCK TABLES Employees WRITE;
INSERT INTO Employees VALUES 
(000000001, 'Michael', 'Kennedy', 'michael.kennedy@bratney.com', 'Drafter'), (000000002, 'Matthew', 'Attebery', 'matthew.attebery@bratney.com', 'Purchasing'), (000000003, 'Bill', 'Bob', 'bill.bob@bratney.com', 'Accounting');
UNLOCK TABLES;

-- 
-- Table structure for Orders
--

CREATE TABLE Orders (
order_num int(6) NOT NULL AUTO_INCREMENT,
order_date date NOT NULL DEFAULT CURRENT_DATE,
order_complete ENUM('Yes', 'No') NOT NULL DEFAULT 'No',
employee_id int(9),
PRIMARY KEY (order_num),
CONSTRAINT FK_Employee_ID FOREIGN KEY(employee_id) REFERENCES Employees(employee_id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Orders
--

LOCK TABLES Orders WRITE;
INSERT INTO Orders VALUES 
(000001, '2022-02-05', 'No', 000000001),
(000002, '2022-01-22', 'No', 000000002),
(000003, '2021-11-15', 'Yes', 000000002);
UNLOCK TABLES;

-- 
-- Table structure for Assembly_parts
-- 

CREATE TABLE Assembly_parts (
assembly_part_id int(11) NOT NULL AUTO_INCREMENT,
assembly_id int(11),
part_id int(11),
part_quantity int(11) DEFAULT 0,
PRIMARY KEY (assembly_part_id),
CONSTRAINT FK_Assembly_ID FOREIGN KEY(assembly_id) REFERENCES Assemblies(assembly_id),
CONSTRAINT FK_Part_ID FOREIGN KEY(part_id) REFERENCES Parts(part_id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Assembly_parts
--

LOCK TABLES Assembly_parts WRITE;
INSERT INTO Assembly_parts VALUES 
(1, 1, 6043, 2),
(2, 2, 6043, 1),
(3, 2, 6063, 3);
UNLOCK TABLES;

-- 
-- Table structure for Order_parts
--

CREATE TABLE Order_parts (
order_part_id int(11) NOT NULL AUTO_INCREMENT,
order_num int(6),
part_id int(11),
part_quantity int(11) DEFAULT 0,
PRIMARY KEY (order_part_id),
CONSTRAINT FK_Order_Num FOREIGN KEY(order_num) REFERENCES Orders(order_num),
CONSTRAINT FK_Part_ID2 FOREIGN KEY(part_id) REFERENCES Parts(part_id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table Order_parts
--

LOCK TABLES Order_parts WRITE;
INSERT INTO Order_parts VALUES 
(1, 000002, 6043, 3),
(2, 000002, 6063, 16),
(3, 000003, 6057, 2000);
UNLOCK TABLES;
