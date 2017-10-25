var express = require('express')
  , http = require('http')
  , path = require('path')
  , controller = require ('./routes/controller');
var cors = require('cors');
var morgan = require('morgan')
var bodyParser = require('body-parser');  
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var mysql = require ('mysql'); 


//mongo connection
var mongoURL =        "mongodb://localhost:27017/DropBox_application";
var mongo = require("./middleware/mongo");



var app = express();

//Enable CORS
var corsOptions = {
	    origin: 'http://localhost:3000',
	    credentials: true,
}
app.use(cors(corsOptions))


app.use(morgan('dev')) ; 






app.set('port', process.env.PORT || 3002);
app.set('view engine', 'ej');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var connection = mysql.createPool({
	 connectionLimit : 2500 ,  
	 host : 'localhost',
	 user : 'root',
	 password : 'root',
	 database : 'palash'
});



mongo.connect(mongoURL, function(db){
	controller(app , db , connection) ; 
})






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
