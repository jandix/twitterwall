const express = require('express');
const handlebars = require('express-handlebars')
    .create({defaultLayout: 'main'});


var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 8080);




// wall
app.get('/', (req, res) => res.status(200).render('wall'));

// 404
app.use('*', (req, res) => res.status(200).render('error404'));

app.listen(app.get('port'), function () {
   console.log( 'Twitter Wall was started.; Press Ctrl-C to terminate.' );
});