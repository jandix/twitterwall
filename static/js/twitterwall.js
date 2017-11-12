var socket = io.connect('http://wall.correlaid.org');
socket.on('connect', function(data) {
    console.log('Connected.');
    socket.emit('join', 'Connected.');
});

socket.on('tweet', function( tweet ) {
    $( '#tweet-wall' ).prepend( '<h4>' + tweet.text + '</h4><p>' + tweet.user.screen_name + ' ' + new Date(tweet.created_at).toLocaleTimeString() );
});