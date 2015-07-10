var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var packagename = "com.example.xuelang";
var n = 100;

client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.shell(device.id, 'monkey -p ' + packagename + ' -v ' + n)
        .then(adb.util.readAll)
        .then(function(output) {
         // console.log('[%s] %s', device.id, output.toString().trim())
        })
    })
  })
  
 .then(function() {
    //console.log('Done.')

  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
