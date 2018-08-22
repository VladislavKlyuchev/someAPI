    var express    = require('express')
    var app        = express()
    var passport   = require('passport')
    var session    = require('express-session')
    var bodyParser = require('body-parser')
    var fs = require('fs');
    var xml2js = require('xml2js');
    var env        = require('dotenv').load()
    var exphbs     = require('express-handlebars')
    var parser = new xml2js.Parser()


    //For BodyParser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


     // For Passport
    app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions


	//Models
    var models = require("./app/models");
    app.use((req, res, next) => {
        req.db = models
        next()
    })  
    //Routes
    var authRoute = require('./app/routes/auth.js')(app,passport);


    //load passport strategies
    require('./app/config/passport/passport.js')(passport,models.user);


    //Sync Database
   	models.sequelize.sync().then(function(){
    console.log('Nice! Database looks fine')

    }).catch(function(err){
    console.log(err,"Something went wrong with the Database Update!")
    });

     //For Handlebars
    app.set('views', './app/views')
    app.engine('hbs', exphbs({extname: '.hbs'}));
    app.set('view engine', '.hbs');
    

    app.get('/', function(req, res){
	  parser.parseString(fs.readFileSync('./xmltv.xml', {encoding: 'utf-8'}), (err,res) => {
        console.log(JSON.stringify(res.tv.channel[0]['$']))
    
      })
	});




	app.listen(5000, function(err){
		if(!err)
		console.log("Site is live"); else console.log(err)

	});




    