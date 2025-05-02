CREATE TABLE Users (
    User_ID INT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL,
    hash CHAR(128) NOT NULL,
    salt CHAR(32) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    User_status BOOLEAN NOT NULL
);

CREATE TABLE Cart (
    CartID INT PRIMARY KEY,
    UserID INT,
    Price INT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(User_ID)
);

CREATE TABLE Inventory (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price INT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CartID INT,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    UserID INT,
    Price INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(User_ID)
);

-- Users
INSERT INTO Users VALUES (1, 'builderbob', 'bob123', 'bob@example.com', TRUE);
INSERT INTO Users VALUES (2, 'legomaster', 'lego456', 'lego@example.com', TRUE);
INSERT INTO Users VALUES (3, 'brickqueen', 'queen789', 'queen@example.com', TRUE);
INSERT INTO Users VALUES (4, 'minifangamer', 'mini000', 'minifan@example.com', TRUE);
INSERT INTO Users VALUES (5, 'brixbuilder', 'brix999', 'brix@example.com', FALSE);  -- inactive user
INSERT INTO Users VALUES (6, 'technicguru', 'gear789', 'tech@example.com', TRUE);
INSERT INTO Users VALUES (7, 'minifigfan', 'brick000', 'mini@example.com', FALSE);


-- Cart
INSERT INTO Cart VALUES (100, 1, 40, 'Active');
INSERT INTO Cart VALUES (101, 2, 60, 'Pending');
INSERT INTO Cart VALUES (102, 3, 85, 'Active');
INSERT INTO Cart VALUES (103, 4, 120, 'Completed');
INSERT INTO Cart VALUES (104, 5, 0, 'Abandoned');
INSERT INTO Cart VALUES (105, 6, 85.99, 'Active');
INSERT INTO Cart VALUES (106, 7, 0, 'Empty');

-- Inventory
INSERT INTO Inventory VALUES (201, 'Lego Space Ship', 25, 'Available', 100);
INSERT INTO Inventory VALUES (202, 'Lego Fire Truck', 35, 'Available', 101);
INSERT INTO Inventory VALUES (203, 'Lego Castle', 60, 'Out of Stock', NULL);
INSERT INTO Inventory VALUES (204, 'Lego Police Station', 45, 'Available', 102);
INSERT INTO Inventory VALUES (205, 'Lego Pirate Ship', 70, 'Available', 103);
INSERT INTO Inventory VALUES (206, 'Lego Speed Car', 40, 'Reserved', 102);
INSERT INTO Inventory VALUES (207, 'Lego Haunted House', 90, 'Available', NULL);
INSERT INTO Inventory VALUES (208, 'Lego Dragon', 65, 'Out of Stock', NULL);
INSERT INTO Inventory VALUES (209, 'Lego Technic Crane', 85.99, 'Available', 102);
INSERT INTO Inventory VALUES (210, 'Lego Police Station', 50.00, 'Available', NULL);
INSERT INTO Inventory VALUES (211, 'Lego Pirate Ship', 70.25, 'Out of Stock', NULL);
INSERT INTO Inventory VALUES (212, 'Lego Supercar', 120.49, 'Available', NULL);

-- Orders
INSERT INTO Orders VALUES (301, 1, 40);
INSERT INTO Orders VALUES (302, 2, 60);
INSERT INTO Orders VALUES (303, 3, 85);
INSERT INTO Orders VALUES (304, 4, 120);
INSERT INTO Orders VALUES (305, 5, 85.99);

