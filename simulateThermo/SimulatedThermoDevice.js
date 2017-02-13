'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString = 'HostName=test-jamesjara.azure-devices.net;DeviceId=test-jamesjara;SharedAccessKey=oVoqeN/GGE9qmdPCYBMQhLM82EkM+U7bCICSBq4UB7E=';

var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');

     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
         var temperature = 10 + (Math.random() * 4);
         var data = JSON.stringify({ deviceId: 'test-jamesjara', temperature: temperature });
         var message = new Message(data);
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 1000);
   }
 };

 client.open(connectCallback);
