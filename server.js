var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var xml2js = require('xml2js');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var parser = new xml2js.Parser();
var cors = require('cors');
const path = require('path');
var sessionController = require('./app/controllers/sessioncontroller.js');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app/views'));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});
// For Passport
app.use(passport.initialize());
//Models
var models = require('./app/models');
app.use((req, res, next) => {
	req.db = models;
	next();
});
app.use((req, res, next) => {
	if (req.body && req.body.sessionId) {
		sessionController(req, res, next);
	} else {
		next();
	}
});
//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.users);

//Sync Database
models.sequelize
	.sync()
	.then(function() {
		console.log('Nice! Database looks fine');
	})
	.catch(function(err) {
		console.log(err, 'Something went wrong with the Database Update!');
	});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/app/views/operator/index.html'));
});
app.get('/admin', function(req, res) {
	res.sendFile(path.join(__dirname + '/app/views/admin/index.html'));
});

app.listen(5000, function(err) {
	if (!err) console.log('Site is live');
	else console.log(err);
});
