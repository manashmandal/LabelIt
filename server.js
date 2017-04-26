var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var database = require('./config/database');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');


// Connect to database
mongoose.connect(database.url);

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


require('./app/routes')(app);

app.listen(port);
console.log("App is listening to port " + port);