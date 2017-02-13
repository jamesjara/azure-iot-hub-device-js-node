'use strict';

var iothub = require('azure-iothub');
var crypto = require('crypto');

var connectionString = 'HostName=thermo.azure-devices.net;SharedAccessKeyName=registryReadWrite;SharedAccessKey=uEzyH+a+dzEvldwsOW/iS1UXqk2e7BgT+Et2wXcMh2U=';

var endpoint ="thermo.azure-devices.net"
var policyName = 'registryReadWrite';
var policyKey = 'uEzyH+a+dzEvldwsOW/iS1UXqk2e7BgT+Et2wXcMh2U=';
var token = generateSasToken(endpoint, policyKey, policyName, 60);

var registry = iothub.Registry.fromConnectionString(connectionString+token);

var device = new iothub.Device(null);
device.deviceId = 'aja';
registry.create(device, function(err, deviceInfo, res) {
  if (err) {
    registry.get(device.deviceId, printDeviceInfo);
  }
  if (deviceInfo) {
    printDeviceInfo(err, deviceInfo, res)
  }
});

function printDeviceInfo(err, deviceInfo, res) {
  console.log(err, deviceInfo, res);
  if (deviceInfo) {
    console.log('Device ID: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
  }
}


function generateSasToken(resourceUri, signingKey, policyName, expiresInMins) {
  resourceUri = encodeURIComponent(resourceUri);

  // Set expiration in seconds
  var expires = (Date.now('2018.08.10') / 1000) + expiresInMins * 60;
  expires = Math.ceil(expires);
  var toSign = resourceUri + '\n' + expires;
  // Use crypto
  var hmac = crypto.createHmac('sha256', new Buffer(signingKey, 'base64'));
  hmac.update(toSign);
  var base64UriEncoded = encodeURIComponent(hmac.digest('base64'));
  // Construct autorization string
  var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
  + base64UriEncoded + "&se=" + expires;
  if (policyName) token += "&skn="+policyName;
  return token;
};
