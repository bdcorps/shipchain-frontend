document.body.onload = function() {

    'use strict';

    // First the socket requesta
    function getReading() {
        console.log('Creating socket');
        let socket = new WebSocket('wss://shipchain-backend.mybluemix.net/public/messagereceive');
        socket.onopen = function() {

            console.log('Socket open.');
            socket.send(JSON.stringify({
                message: 'What is the meaning of life, the universe and everything?'
            }));
            console.log('Message sent.')
        };
        socket.onmessage = function(message) {

            console.log('Socket server message', message);
            let data = JSON.parse(message.data);
            document.getElementById('response').innerHTML = JSON.stringify(data, null, 2);
        };
    }
    getReading();

    function showMessage(msg) {
        alert(msg);
    };
}
