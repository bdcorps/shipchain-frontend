'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

// Let's create the regular HTTP request and response
app.get('/', function(req, res) {

    console.log('Get index');
    fs.createReadStream('./index.html')
        .pipe(res);
});

module.exports = app;
