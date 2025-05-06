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
    image_filename TEXT,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    UserID INT,
    Price INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(User_ID)
);

-- First insert users (must match schema)
INSERT INTO Users (User_ID, Username, Hash, Salt, Email, User_status) VALUES
(1, 'builderbob', 'fakehash1', 'fakesalt1', 'bob@example.com', TRUE),
(2, 'legomaster', 'fakehash2', 'fakesalt2', 'lego@example.com', TRUE);
-- etc...

-- Then insert carts referencing existing users
INSERT INTO Cart VALUES (100, 1, 40, 'Active');
INSERT INTO Cart VALUES (101, 2, 60, 'Pending');


-- Inventory
INSERT INTO Inventory (ProductID, ProductName, Price, Status, CartID, image_filename)
VALUES (201, 'AT-AT', 25, 'Available', 100, 'atat.png');
-- INSERT INTO Inventory VALUES (202, 'Lego Fire Truck', 35, 'Available', 101);
-- INSERT INTO Inventory VALUES (203, 'Lego Castle', 60, 'Out of Stock', NULL);
-- INSERT INTO Inventory VALUES (204, 'Lego Police Station', 45, 'Available', 102);
-- INSERT INTO Inventory VALUES (205, 'Lego Pirate Ship', 70, 'Available', 103);
-- INSERT INTO Inventory VALUES (206, 'Lego Speed Car', 40, 'Reserved', 102);
-- INSERT INTO Inventory VALUES (207, 'Lego Haunted House', 90, 'Available', NULL);
-- INSERT INTO Inventory VALUES (208, 'Lego Dragon', 65, 'Out of Stock', NULL);
-- INSERT INTO Inventory VALUES (209, 'Lego Technic Crane', 85.99, 'Available', 102);
-- INSERT INTO Inventory VALUES (210, 'Lego Police Station', 50.00, 'Available', NULL);
-- INSERT INTO Inventory VALUES (211, 'Lego Pirate Ship', 70.25, 'Out of Stock', NULL);
-- INSERT INTO Inventory VALUES (212, 'Lego Supercar', 120.49, 'Available', NULL);

-- Orders
INSERT INTO Orders VALUES (301, 1, 40);
INSERT INTO Orders VALUES (302, 2, 60);
-- INSERT INTO Orders VALUES (303, 3, 85);
-- INSERT INTO Orders VALUES (304, 4, 120);
-- INSERT INTO Orders VALUES (305, 5, 85.99);

