const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const Twitter = require('twitter');

var app = express();




app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use("/static", express.static(__dirname + "/static"));
app.use("/", express.static(__dirname + '/node_modules'));


var twitter = new Twitter({
    consumer_key: 'W6HSyXNXsWk9rq3SjNAtlBZuO',
    consumer_secret: 'mGG5ezQ6cNM6wfXQj1w9DGQV5lJzQLVL8Tf1CFpbb31ZQkK4Rv',
    access_token_key: '3372623884-iqa73dotaZgHB7q8twAfIvxHgf0CC211fQcDmKg',
    access_token_secret: 'RZiuaiUPe3U0R7qVsSFAeKQpwV5CNohNFeFCGTsNGlYPz'
});

// wall
app.get('/', (req, res) => res.status(200).render('wall'));

// 404
app.use('*', (req, res) => res.status(200).render('error404'));



var stream = twitter.stream('statuses/filter', {track: '#rstats, #dataviz, #datavis, #DataScience, #tidyverse, #rladies'});

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