var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'accounts'
});

var app = express();
app.use(cors());
app.use(session({
    name: 'codeil',
    secret: 'something',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/login.vue'));
});

// const object2 = {
//     username: "test",
//     password: "1234"
// }

// const array1 = [
//     {
//         id: 0,
//         username: 'prame',
//         password: '1234',
//         email: 'prame@hotmail.com'
//     },
//     {
//         id: 1,
//         username: 'pond',
//         password: '1234',
//         email: 'prame@hotmail.com'
//     },
//     {
//         id: 2,
//         username: 'fluke',
//         password: '1234',
//         email: 'fluke@hotmail.com'
//     }
// ]




// for (let i = 0; i < array1.length; i++) {
//     if((array1[i].id == 1) {
//         console.log(array1[i].username)
//     }
// }



// error = {
//     success: false,
//     message: "user not found"
// }

// success = {
//     success: true,
//     message: "success",
//     data: {
//         username: username,
//         token: token,
//         email: email
//     }
// }
app.post('/auth2', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    console.log(username, password)
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
            console.log(results)
            if (results.length > 0) {
                console.log(results[0])
                response.send({
                    success: true,
                    message: "correct",
                    data: results[0]
                });
            } else {
                response.send({
                    success: false,
                    message: "not correct",

                });
            }
        });
    } else {
        response.send('pls enter username and password')
    }
});

app.post('/auth', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('username and password not correct');
            }
        });

    } else {
        response.send('pls enter username and password')
        response.end();
    }
});

app.get('/home', (request, response) => {
    if (request.session.loggedin) {
        response.send({ 'message': 'Welcome back, ' + request.session.username + '!' });
    } else {
        response.send({ 'message': 'Please login to view this page!' });
    }
});

app.get("/pulldata", function(request, response, next){

    
    //Select all customers and return the result object:
    connection.query("SELECT * FROM accounts", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.json(result[0])
    });

});


app.listen(9000, () => {
    console.log('Application is running on port 9000');
});
