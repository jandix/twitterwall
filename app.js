const express = require('express');
const handlebars = require('express-handlebars')
    .create({defaultLayout: 'main'});
const Twitter = require('twitter');

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 8080);



var client = new Twitter({
    consumer_key: 'W6HSyXNXsWk9rq3SjNAtlBZuO',
    consumer_secret: 'mGG5ezQ6cNM6wfXQj1w9DGQV5lJzQLVL8Tf1CFpbb31ZQkK4Rv',
    access_token_key: '3372623884-iqa73dotaZgHB7q8twAfIvxHgf0CC211fQcDmKg',
    access_token_secret: 'RZiuaiUPe3U0R7qVsSFAeKQpwV5CNohNFeFCGTsNGlYPz'
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: '#rstats'},  function(stream) {
    stream.on('data', function(tweet) {
        console.log(tweet.text);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});


// wall
app.get('/', (req, res) => res.status(200).render('wall'));

// 404
app.use('*', (req, res) => res.status(200).render('error404'));

app.listen(app.get('port'), function () {
   console.log( 'Twitter Wall was started.; Press Ctrl-C to terminate.' );
});