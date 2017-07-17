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

    $("#registrarButton").click(function() {
        console.log("about to register");

        var json = {
            "enrollId": "user_type1_1",
            "enrollSecret": "17a64f95ec"
        }
        $.ajax({
            url: 'https://fc082e2e78bf4e93890d38acf3ee9678-vp0.us.blockchain.ibm.com:5002/registrar',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });

    $("#deployChaincodeButton").click(function() {
        console.log("about to deploy chaincode");

        var json = {
            "jsonrpc": "2.0",
            "method": "deploy",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "path": "http://gopkg.in/bdcorps/learn-chaincode.v2/start"
                },
                "ctorMsg": {
                    "function": "init"
                },
                "secureContext": "user_type1_0"
            },
            "id": 1
        }
        $.ajax({
            url: 'https://fc082e2e78bf4e93890d38acf3ee9678-vp0.us.blockchain.ibm.com:5002/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });
    $("#initShipmentButton").click(function() {
        console.log("about to invoke shipment");

        var json = {
            "jsonrpc": "2.0",
            "method": "invoke",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "name": "9e71e45a0c2c7fb43577ec5a32736f508f3ec53e8b9bf3ab2bbab2f788216182214b34cc908331058fe9258a5a13d068c4419d34dd4d69007e6ef9244a67cc1e"
                },
                "ctorMsg": {
                    "function": "init_shipment",
                    "args": ["ship1", "10", "10", "25", "id"]
                },
                "secureContext": "user_type1_0"
            },
            "id": 5
        }

        $.ajax({
            url: 'https://fc082e2e78bf4e93890d38acf3ee9678-vp0.us.blockchain.ibm.com:5002/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });
    $("#readShipmentButton").click(function() {
        console.log("about to read shipment");

        var json = {
            "jsonrpc": "2.0",
            "method": "invoke",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "name": "9e71e45a0c2c7fb43577ec5a32736f508f3ec53e8b9bf3ab2bbab2f788216182214b34cc908331058fe9258a5a13d068c4419d34dd4d69007e6ef9244a67cc1e"
                },
                "ctorMsg": {
                    "function": "read"
                },
                "secureContext": "user_type1_0"
            },
            "id": 5
        }
        $.ajax({
            url: 'https://fc082e2e78bf4e93890d38acf3ee9678-vp0.us.blockchain.ibm.com:5002/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });

    $("#setReadingButton").click(function() {
        console.log("about to set reading");

        var json = {
            "jsonrpc": "2.0",
            "method": "query",
            "params": {
                "type": 1,
                "chaincodeID": {
                    "name": "9e71e45a0c2c7fb43577ec5a32736f508f3ec53e8b9bf3ab2bbab2f788216182214b34cc908331058fe9258a5a13d068c4419d34dd4d69007e6ef9244a67cc1e"
                },
                "ctorMsg": {
                    "function": "set_temp",
                    "args": ["ship1", "9"]
                },
                "secureContext": "user_type1_0"
            },
            "id": 5
        }

        $.ajax({
            url: 'https://fc082e2e78bf4e93890d38acf3ee9678-vp0.us.blockchain.ibm.com:5002/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });
}
