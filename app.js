/*
    SETUP
*/

//Express
const express = require("express");
const app = express();
const PORT = 4192;

//Database
const db = require('./database/db-connector')

//Handlebars
const { engine } = require('express-handlebars');
const { response } = require("express");
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


/*
    ROUTES
*/
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/partsPage', function (req, res) {

    //Populate parts table
    let query1 = "SELECT * FROM Parts ORDER BY part_id DESC;";

    let query2 = "SELECT * FROM Vendors ORDER BY vendor_id Desc;";

    //Run query 1
    db.pool.query(query1, function (error, rows, fields) {

        //Save the parts
        let part_rows = rows;

        //Run query 2
        db.pool.query(query2, (error, rows, fields) => {

            //Save the vendors
            let vendor_rows = rows;
            return res.render('partsPage', { data: part_rows, vendor_id: vendor_rows });
        })
    });
});

app.get('/vendorsPage', function (req, res) {

    let query1 = "SELECT * FROM Vendors ORDER BY vendor_id DESC;";

    db.pool.query(query1, function (error, rows, fields) {
        res.render('vendorsPage', { data: rows });
    })
});

app.get('/ordersPage', function (req, res) {

    let query1 = "SELECT order_num, DATE_FORMAT(order_date, '%Y-%m-%d') AS date, order_complete, employee_id FROM Orders ORDER BY Order_num DESC;";

    let query2 = "SELECT * FROM Employees ORDER BY first_name ASC;";

    db.pool.query(query1, function (error, rows, fields) {

        let order_rows = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let employee_rows = rows;
            return res.render('ordersPage', { data: order_rows, employee_id: employee_rows });
        })
    });
});



app.get('/assembliesPage', function (req, res) {
    let query1 = "SELECT * FROM Assemblies ORDER BY assembly_id DESC;";

    db.pool.query(query1, function (error, rows, fields) {
        res.render('assembliesPage', { data: rows });
    })
});

app.get('/employeesPage', function (req, res) {
    let query1 = "SELECT * FROM Employees ORDER BY first_name ASC;";

    db.pool.query(query1, function (error, rows, fields) {
        res.render('employeesPage', { data: rows });
    })
});

app.get('/orderPartsPage', function (req, res) {

    let query1 = "SELECT * FROM Order_parts ORDER BY Order_part_id DESC;"

    let query2 = "SELECT * FROM Parts ORDER BY part_id DESC;";

    let query3 = "SELECT * FROM Orders ORDER BY order_num DESC;"

    db.pool.query(query1, function (error, rows, fields) {

        let order_part_rows = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let part_rows = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let order_rows = rows

                return res.render('orderPartsPage', { data: order_part_rows, part_id: part_rows, order_num: order_rows });
            })
        })
    });
});

app.get('/assemblyPartsPage', function (req, res) {
    let query1 = "SELECT * FROM Assembly_parts ORDER BY assembly_part_id DESC;";

    let query2 = "SELECT * FROM Assemblies ORDER BY assembly_id DESC;";

    let query3 = "SELECT * FROM Parts ORDER BY part_id DESC;";

    db.pool.query(query1, function (error, rows, fields) {

        let assem_part_rows = rows;

        db.pool.query(query2, (error, rows, fields) => {

            let assembly_rows = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let part_rows = rows;

                return res.render('assemblyPartsPage', { data: assem_part_rows, assembly_id: assembly_rows, part_id: part_rows });

            })
        });
    });
});

app.post('/add-vendor-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Vendors (vendor_name) VALUES ('${data['vendor_name']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('vendorsPage');
        }
    });
});

app.post('/add-part-form', function (req, res) {
    //Capture incoming data and parse back to JS object
    let data = req.body;

    //Capture NULL values
    let vendor_num = parseInt(data['vendor_num']);
    if (isNaN(vendor_num)) {
        vendor_num = 'NULL'
    }

    //Create query to run on database
    query1 = `INSERT INTO Parts (vendor_id, vendor_num, part_name, inventory_quantity) VALUES ('${data['vendor_id']}', '${data['vendor_num']}', '${data['part_name']}', '${data['inventory_quantity']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/partsPage');
        }
    });
});

app.post('/add-assembly-form', function (req, res) {
    let data = req.body

    let assem_name = parseInt(data['assem_name']);
    if (isNaN(assem_name)) {
        assem_name = 'NULL'
    }

    query1 = `INSERT INTO Assemblies (assembly_num, assem_name) VALUES ('${data['assembly_num']}', '${data['assem_name']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/assembliesPage');
        }
    });
});


app.post('/add-employee-form', function (req, res) {
    //Capture incoming data and parse back to JS object
    let data = req.body;

    //Capture NULL values
    let email = parseInt(data['email']);
    if (isNaN(email)) {
        email = 'NULL'
    }

    let position = parseInt(data['position']);
    if (isNaN(position)) {
        position = 'NULL'
    }

    //Create query to run on database
    query1 = `INSERT INTO Employees (first_name, last_name, email, position) VALUES ('${data['first_name']}', '${data['last_name']}', '${data['email']}', '${data['position']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/employeesPage');
        }
    });
});

app.post('/add-order-form', function (req, res) {
    //Capture incoming data and parse back to JS object
    let data = req.body;

    //No NULL Values

    //Create query to run on database
    query1 = `INSERT INTO Orders (employee_id) VALUES ('${data['employee_id']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/ordersPage');
        }
    });
});

app.post('/add-assem-part-form', function (req, res) {
    //Capture incoming data and parse back to JS object
    let data = req.body;

    //No NULL Values

    //Create query to run on database
    query1 = `INSERT INTO Assembly_parts (assembly_id, part_id, part_quantity) VALUES ('${data['assembly_id']}', '${data['part_id']}', '${data['part_quantity']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/assemblyPartsPage');
        }
    });
});

app.post('/add-order-part-form', function (req, res) {
    //Capture incoming data and parse back to JS object
    let data = req.body;

    //No NULL Values

    //Create query to run on database
    query1 = `INSERT INTO Order_parts (order_num, part_id, part_quantity) VALUES ('${data['order_num']}', '${data['part_id']}', '${data['part_quantity']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/orderPartsPage');
        }
    });
});

app.delete('/delete-order/:order_num', function (req, res, next) {
    let deleteOrder_parts = `DELETE FROM Order_parts WHERE order_num = ?`;
    let deleteOrders = `DELETE FROM Orders WHERE order_num = ?`;

    //Run first query
    db.pool.query(deleteOrder_parts, [req.params.order_num], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(deleteOrders, [req.params.order_num], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-order-part/:order_part_id', function (req, res, next) {
    let deleteOrder_parts = `DELETE FROM Order_parts WHERE order_part_id = ?`;

    //Run first query
    db.pool.query(deleteOrder_parts, [req.params.order_part_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.put('/update-order/:order_num/:order_date/:order_complete/:employee_id', function (req, res, next) {
    let updateOrders = `UPDATE Orders SET order_date = ?, order_complete = ?, employee_id = ? WHERE order_num = ?`;
    let inserts = [req.params.order_date, req.params.order_complete, req.params.employee_id, req.params.order_num];

    //Run first query
    db.pool.query(updateOrders, inserts, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.put('/update-order-parts/:order_part_id/:part_id/:part_quantity', function (req, res, next) {
    let updateOrder_parts = `UPDATE Order_parts SET part_id = ?, part_quantity = ? WHERE order_part_id = ?`;
    let inserts = [req.params.part_id, req.params.part_quantity, req.params.order_part_id];

    //Run first query
    db.pool.query(updateOrder_parts, inserts, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});




/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});