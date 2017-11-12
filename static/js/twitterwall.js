/*
    Author: Jan Dix (dix.jan@gmx.de)
    License: MIT
 */

var i = 0;


var socket = io.connect('http://wall.correlaid.org');
socket.on('connect', function(data) {
    console.log('Connected.');
    socket.emit('join', 'Connected.');
});

socket.on('tweet', function( tweet ) {

    if (i < 1) {
        console.log( tweet );
    }

    i++;

    var tweetItem = '<div class="tweet">';
    tweetItem += '<div class="row">';
    tweetItem += '<div class="col-4">';
    tweetItem += '<img src="' + tweet.user.profile_image_url + '" class="img-fluid"/>';
    tweetItem += '</div>';
    tweetItem += '<div class="col-8>';
    tweetItem += '<p><b>' + tweet.user.screen_name + '</b></p>';
    tweetItem += '<p>' + new Date(tweet.created_at).toLocaleDateString() +  ' ' +  new Date(tweet.created_at).toLocaleTimeString() + '</p>';
    tweetItem += '</div>';
    tweetItem += '</div>';
    tweetItem += '<div class="row">';
    tweetItem += '<div class="col-12">';
    tweetItem += '<h5>' + tweet.text + '</h5>';
    tweetItem += '</div>';
    tweetItem += '</div>';
    tweetItem += '</div>';

    $( '#tweet-wall' ).prepend( tweetItem );

});