'use strict';

let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./http-server');

// Create web socket server on top of a regular http server
let wss = new WSServer({

    server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {

        console.log(`received: ${message}`);

        ws.send(JSON.stringify({

            answer: 42
        }));
    });
});


if (!process.env.VCAP_SERVICES) {
    app.use(errorhandler());
}
var port = 8080;
app.listen(port);
console.log('listening at:', port);
