// window.onload = function() {
$(document).ready(function() {

    'use strict';

    var shipmentName = "what2";
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

            if (temp > 20) {
                console.log("compensate");
                money += 10;
                $('#money').html("$ " + money);
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
            url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chain',
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
                        "args": [targetShipmentName, JSON.stringify(targetTemp), JSON.stringify(targetMoney)]
                    },
                    "secureContext": "user_type1_1"
                },
                "id": 1
            }

            $.ajax({
                url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chaincode',
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

    ccname = "0fd8458bd6eae490c7878a8ff4a66ea12f1c985a6a8c38be72ef028847c349789ddb68f3c282536220b78654fb6190d0c8ac2a447aae2a5e85333179c1c4bb87"



    $("#registrarButton").click(function() {
        console.log("about to register");

        var json = {
            "enrollId": "user_type1_1",
            "enrollSecret": "5b1c69c518"
        }
        $.ajax({
            url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/registrar',
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
                "secureContext": "user_type1_1"
            },
            "id": 1
        }
        $.ajax({
            url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response-main').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });
    $("#initShipmentGoButton").on('click', function() {
        console.log("about to invoke shipment");
        shipmentName = $("#shipment-name").val();
        var latitude = $("#shipment-lat").val();
        var longitude = $("#shipment-long").val();
        var temp = $("#shipment-temp").val();
        var shipmentOwnerName = $("#owner-name").val();

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
                    "args": [shipmentName, latitude, longitude, temp, shipmentOwnerName, "0"]
                },
                "secureContext": "user_type1_1"
            },
            "id": 1
        }

        $.ajax({
            url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chaincode',
            type: 'post',
            contentType: "application/json",
            success: function(data) {
                $('#response-main').append("\n" + JSON.stringify(data));
                console.log("the blockchain said: " + JSON.stringify(data))
            },
            data: JSON.stringify(json)
        });
    });
    $("#readShipmentGoButton").click(function() {
        console.log("about to read shipment");

        var queryShipmentName = $("#shipment-name").val();
        //  var queryShipmentName = shipmentName;

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
                    "secureContext": "user_type1_1"
                },
                "id": 1
            }
            $.ajax({
                url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chaincode',
                type: 'post',
                contentType: "application/json",
                success: function(data) {
                    $('#response-main').append("\n" + data.result.message);
                    console.log("the blockchain said: " + JSON.stringify(data))
                },
                data: JSON.stringify(json)
            });
        }
    });

    $("#setReadingGoButton").click(function() {
        console.log("about to set reading");
        var targetShipmentName = $("#shipment-name").val();
        var targetTemp = $("#shipment-temp").val();
        var targetMoney = money;

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
                        "args": [targetShipmentName, targetTemp, targetMoney.toString()]
                    },
                    "secureContext": "user_type1_1"
                },
                "id": 1
            }

            $.ajax({
                url: 'https://0176382327164b8e90486a148fcfa0e8-vp0.us.blockchain.ibm.com:5003/chaincode',
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


    $(".dashToggle").click(function() {
        var dash = $('#dashboard');
        // if (dash.hasClass("showDashboard")) {
        //     dash.removeClass("showDashboard");
        //     dash.addClass("hideDashboard");
        // } else {
        //     dash.removeClass("hideDashboard");
        //     dash.addClass("showDashboard");
        // }
        dash.toggleClass('showDashboard').toggleClass('hideDashboard');
        $(".dashToggle").toggleClass('hidden');
    });

    $(".dropdown .dropdown-content").on('click', 'a', function() {
        $(".dropbtn").empty().html($(this).text());
        if ($("#shipment-info").removeClass('hidden'))

            $("#shipment-info").find('input').addClass('hidden');
        $("#shipment-info").find('button').addClass('hidden');
        if ($(this).attr('id') === 'initShipmentButton') {
            $("#shipment-info").find('input').addClass('hidden');
            $(".create").toggleClass('hidden');
        } else if ($(this).attr('id') === 'readShipmentButton') {
            $("#shipment-info").find('input').addClass('hidden');
            $(".read").toggleClass('hidden');
        } else if ($(this).attr('id') === 'setReadingButton') {
            $("#shipment-info").find('input').addClass('hidden');
            $(".set").toggleClass('hidden');
        }
    })
}); //document.ready
// };
