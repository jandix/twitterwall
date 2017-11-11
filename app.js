const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const Twitter = require('twitter');

var app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', 8080);


app.use(express.static(__dirname + '/node_modules'));

var client = new Twitter({
    consumer_key: 'W6HSyXNXsWk9rq3SjNAtlBZuO',
    consumer_secret: 'mGG5ezQ6cNM6wfXQj1w9DGQV5lJzQLVL8Tf1CFpbb31ZQkK4Rv',
    access_token_key: '3372623884-iqa73dotaZgHB7q8twAfIvxHgf0CC211fQcDmKg',
    access_token_secret: 'RZiuaiUPe3U0R7qVsSFAeKQpwV5CNohNFeFCGTsNGlYPz'
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.stream('statuses/filter', {track: '#rstats, #typischerBundesligaSamstag'},  function(stream) {
            stream.on('data', function(tweet) {
                console.log(tweet);
                client.emit('tweet', tweet);
            });

            stream.on('error', function(error) {
                console.log(error);
            });
        });
    });



// wall
app.get('/', (req, res) => res.status(200).render('wall'));

// 404
app.use('*', (req, res) => res.status(200).render('error404'));

server.listen( app.get('port') );