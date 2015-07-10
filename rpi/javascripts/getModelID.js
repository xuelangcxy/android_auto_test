var Promise = require('bluebird')
var adb = require('adbkit')
var client = adb.createClient()

module.exports = function(cb){
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.shell(device.id, 'getprop ril.model_id')
        .then(adb.util.readAll)
        .then(function(output) {
          //console.log('[%s] %s', device.id, output.toString().trim())
          cb(output.toString().trim());
        })
    })
  })

  .then(function() {
 
})
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
}
