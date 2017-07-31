window.onload = function() {
    $(document).ready(function() {

        'use strict';

        var shipmentName = "what1";
        var blockHeight = 0;
        var temp = 0;
        var money = 0;

        $('#temp').html(temp + " &#186;C");

        $('#money').html("$ " + money);

        getChainLength();
        $('#trackingShipmentInput').val(shipmentName);
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
                temp = JSON.stringify(data, null, 2);

                if (temp > 25) {
                    console.log("compensate");
                    money += 10;
                    $('#money').html(money + "$ " + money);
                }
                $('#temp').html(temp + " &#186;C");
                console.log("tempd " + temp);
                setReading(JSON.stringify(data, null, 2), money);
                getChainLength();

                $('#blockChain').append('<div class="block"><p class="blockText">' + blockHeight + '</p></div>');

            };
        }

        function getChainLength() {
            $.ajax({
                url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chain',
                type: 'get',
                contentType: "application/json",
                success: function(data) {
                    $('#response-main').append("\n" + JSON.stringify(data.height));
                    console.log("no of blocks: " + JSON.stringify(data.height));
                    blockHeight = parseInt(JSON.stringify(data.height));
                },
                async: false
            });
        }

        function setReading(targetTemp, targetMoney) {
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
                            "args": [targetShipmentName, targetTemp, targetMoney]
                        },
                        "secureContext": "user_type1_0"
                    },
                    "id": 5
                }

                $.ajax({
                    url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response-main').append("\n" + JSON.stringify(data));
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

        ccname = "a8fbdd3f36c23f072740368aad32d233d0e0812de68e6eb5d528207297575b8bb0c3a81aa3b26bcaf7437195a69f5411808b21e0e164081b15901254099890b3"



        $("#registrarButton").click(function() {
            console.log("about to register");

            var json = {
                "enrollId": "user_type1_0",
                "enrollSecret": "5b1c69c518"
            }
            $.ajax({
                url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/registrar',
                type: 'post',
                contentType: "application/json",
                success: function(data) {
                    $('#response-main').append("\n" + JSON.stringify(data));
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
                url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chaincode',
                type: 'post',
                contentType: "application/json",
                success: function(data) {
                    $('#response-main').append("\n" + JSON.stringify(data));
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
                url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chaincode',
                type: 'post',
                contentType: "application/json",
                success: function(data) {
                    $('#response-main').append("\n" + JSON.stringify(data));
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
                    "method": "query",
                    "params": {
                        "type": 1,
                        "chaincodeID": {
                            "name": ccname
                        },
                        "ctorMsg": {
                            "function": "readShipment",
                            "args": [queryShipmentName]
                        },
                        "secureContext": "user_type1_0"
                    },
                    "id": 5
                }
                $.ajax({
                    url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response-main').append("\n" + JSON.stringify(data));
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
                    url: 'https://a98b6dfcd66548868e738278b07eec78-vp0.us.blockchain.ibm.com:5002/chaincode',
                    type: 'post',
                    contentType: "application/json",
                    success: function(data) {
                        $('#response-main').append("\n" + JSON.stringify(data));
                        console.log("the blockchain said: " + JSON.stringify(data))
                    },
                    data: JSON.stringify(json)
                });
            }
        });


        $("#dashToggle").click(function() {
            var dash = $('#dashboard');
            if (dash.hasClass("showDashboard")) {
                dash.removeClass("showDashboard");
                dash.addClass("hideDashboard");
            } else {
                dash.removeClass("hideDashboard");
                dash.addClass("showDashboard");
            }
        });

    });
};
