// load modules
const path = require('path'); // define realtive paths
const express = require('express'); // express framework
const handlebars = require('express-handlebars'); // handlebar views
const Twitter = require('twitter'); // twitter api
const http = require('http'); // http module
const mongoose = require('mongoose'); // load mongo db module
const Schema = mongoose.Schema; // mongoose schema

// set constants
const port = parseInt(process.env.PORT, 10) || 8080; // set port


// set up default mongoose connection
var mongoDB = 'mongodb://jand:asdliutaisgud672143kjjk21389asdAASF!@ds161455.mlab.com:61455/twitterwall';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

// get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tweetSchema = new Schema({
    id: String,
    text: String,
    user: {
        id: String,
        screen_name: String,
        name: String,
        img_url: String
    },
    img_url: String,
    created_at: Date
});

var Tweet = mongoose.model('Tweet', tweetSchema);

// set default variables
// create new Twitter object using credentials
var twitter = new Twitter({
    consumer_key: 'W6HSyXNXsWk9rq3SjNAtlBZuO',
    consumer_secret: 'mGG5ezQ6cNM6wfXQj1w9DGQV5lJzQLVL8Tf1CFpbb31ZQkK4Rv',
    access_token_key: '3372623884-iqa73dotaZgHB7q8twAfIvxHgf0CC211fQcDmKg',
    access_token_secret: 'RZiuaiUPe3U0R7qVsSFAeKQpwV5CNohNFeFCGTsNGlYPz'
});

// define express as main framework
var app = express();
// set port
app.set('port', port);

// create a server
const server = http.createServer(app);

// load socket.io
const io = require('socket.io')(server);

// set view directory
app.set('views', path.join(__dirname, 'views'));

// configure handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// define static paths
app.use("/static", express.static(__dirname + "/static"));
app.use("/", express.static(__dirname + '/node_modules'));

// start twitter streaming api
var stream = twitter.stream('statuses/filter', {track: '#tidyverse, #rstats, python, javascript -filter:retweets'});

stream.on('data', function(event) {

    var img = null;
    if ( event.extended_tweet ) img = event.extended_tweet.entities.media[0].media_url;

    var tweet = new Tweet({
        id: event.id,
        text: event.text,
        user: {
            id: event.user.id,
            screen_name: event.user.screen_name,
            name: event.user.name,
            img_url: event.user.profile_image_url_https
        },
        img_url: img,
        created_at: new Date(event.created_at)
    });

    tweet.save(function(err) {
        if (err) throw err;
        console.log('#' + event.id + ' saved successfully!');
    });
});

// define routes
// wall
app.get('/', (req, res) => res.status(200).render('wall'));
// 404
app.use('*', (req, res) => res.status(200).render('error404'));


// define socket io
io.on('connection', function(client) {
    console.log('Client connected...');
    client.on('join', function (data) {
        console.log(data);
        stream.on('data', function(event) {
            client.emit('tweet', event);
        });

        stream.on('error', function(error) {
            throw error;
        });
    });
});

// start server
server.listen(port);