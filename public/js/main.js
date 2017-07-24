window.onload = function() {
    $(document).ready(function() {

        'use strict';

        var shipmentName = "what1";
        var blockHeight = 0;

        getChainLength();

        console.log("starting chain length: " + blockHeight);
        for (var i = blockHeight - 5; i < blockHeight; i++) {

            $('#blockChain').append('<div class="block"><p class="blockText">' + i + '</p></div>');

        }


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
                setReading(JSON.stringify(data, null, 2));
                getChainLength();

                $('#blockChain').append('<div class="block"><p class="blockText">' + blockHeight + '</p></div>');

            };
        }

        function getChainLength() {
            $.ajax({
                url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chain',
                type: 'get',
                contentType: "application/json",
                success: function(data) {
                    $('#response').append("\n" + JSON.stringify(data.height));
                    console.log("no of blocks: " + JSON.stringify(data.height));
                    blockHeight = parseInt(JSON.stringify(data.height));
                },
                async: false
            });
        }

        function setReading(targetTemp) {
            console.log("about to set reading");
            //var targetShipmentName = $("#targetShipmentName").val();
            var targetShipmentName = shipmentName;
            //  var targetTemp = $("#targetTemp").val();

            if (shipmentName == "") {
                console.log("init shipment first");
            } else {
                var json = {
                    "jsonrpc": "2.0",
                    "method": "invoke",
                    "params": {
                        "type": 1,
                        "chaincodeID": {
                            "name": ccname
                        },
                        "ctorMsg": {
                            "function": "set_temp",
                            "args": [targetShipmentName, targetTemp]
                        },
                        "secureContext": "user_type1_0"
                    },
                    "id": 5
                }

                $.ajax({
                    url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response').append("\n" + JSON.stringify(data));
                        console.log("the blockchain said: " + JSON.stringify(data))
                    },
                    data: JSON.stringify(json)
                });
            }
        }

        getReading();



        var ccname = $("#ccName").val();
        $("#ccName").on("change paste keyup", function() {
            //ccname = $("#ccName").val();
        });

        ccname = "bab9e777d3bee798e0895710aa1f74e0784ce680a517a3a7bb98cd5bc24f5add71935a3efca99e5bb26c027a9224b9eb14feaef27cdab04bb0afdaa45d9cfc91"



        $("#registrarButton").click(function() {
            console.log("about to register");

            var json = {
                "enrollId": "user_type1_0",
                "enrollSecret": "b6258d7adf"
            }
            $.ajax({
                url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/registrar',
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
                        "function": "init",
                        "args": ["hi there"]
                    },
                    "secureContext": "user_type1_0"
                },
                "id": 1
            }
            $.ajax({
                url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chaincode',
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
            shipmentName = $("#shipmentName").val();
            var longitude = $("#longitude").val();
            var latitude = $("#latitude").val();
            var temp = $("#temp").val();
            var shipmentId = $("#shipmentId").val();

            var json = {
                "jsonrpc": "2.0",
                "method": "invoke",
                "params": {
                    "type": 1,
                    "chaincodeID": {
                        "name": ccname
                    },
                    "ctorMsg": {
                        "function": "init_shipment",
                        "args": [shipmentName, longitude, latitude, temp, shipmentId]
                    },
                    "secureContext": "user_type1_0"
                },
                "id": 5
            }

            $.ajax({
                url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chaincode',
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

            //var queryShipmentName = $("#queryShipmentName").val();
            var queryShipmentName = shipmentName;

            if (shipmentName == "") {
                console.log("init shipment first");
            } else {

                var json = {
                    "jsonrpc": "2.0",
                    "method": "invoke",
                    "params": {
                        "type": 1,
                        "chaincodeID": {
                            "name": ccname
                        },
                        "ctorMsg": {
                            "function": "read",
                            "args": [queryShipmentName]
                        },
                        "secureContext": "user_type1_0"
                    },
                    "id": 5
                }
                $.ajax({
                    url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response').append("\n" + JSON.stringify(data));
                        console.log("the blockchain said: " + JSON.stringify(data))
                    },
                    data: JSON.stringify(json)
                });
            }
        });

        $("#setReadingButton").click(function() {
            console.log("about to set reading");
            //var targetShipmentName = $("#targetShipmentName").val();
            var targetShipmentName = shipmentName;
            var targetTemp = $("#targetTemp").val();

            if (shipmentName == "") {
                console.log("init shipment first");
            } else {
                var json = {
                    "jsonrpc": "2.0",
                    "method": "invoke",
                    "params": {
                        "type": 1,
                        "chaincodeID": {
                            "name": ccname
                        },
                        "ctorMsg": {
                            "function": "set_temp",
                            "args": [targetShipmentName, targetTemp]
                        },
                        "secureContext": "user_type1_0"
                    },
                    "id": 5
                }

                $.ajax({
                    url: 'https://197af3d609254a0b91850fea5d6d88af-vp0.us.blockchain.ibm.com:5004/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response').append("\n" + JSON.stringify(data));
                        console.log("the blockchain said: " + JSON.stringify(data))
                    },
                    data: JSON.stringify(json)
                });
            }
        });
    });


};
