var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var fs = require('fs');
var lineReader = require('line-reader');

module.exports = function(cb) {
  client.listDevices()
    .then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.shell(device.id, 'cat /proc/meminfo | grep "MemFree" > /sdcard/autotest/freeMem.txt')
          .then(adb.util.readAll)
          .then(function(output) {
            // console.log('[%s] %s', device.id, output.toString().trim())
          })
      })
    })

  .then(function() {
      //console.log('Done.')

      client.listDevices()
        .then(function(devices) {
          return Promise.map(devices, function(device) {
            return client.pull(device.id, '/sdcard/autotest/freeMem.txt')
              .then(function(transfer) {
                return new Promise(function(resolve, reject) {
                  var fn = './tmp/' + 'freeMem.txt'
                  transfer.on('progress', function(stats) {
                    //   console.log('[%s] Pulled %d bytes so far', device.id, stats.bytesTransferred)
                  })
                  transfer.on('end', function() {
                    // console.log('[%s] Pull complete', device.id)

                    lineReader.open('./tmp/freeMem.txt', function(reader) {
                      if (!reader.hasNextLine()) {
                        cb(0);
                      };
                      if (reader.hasNextLine()) {
                        reader.nextLine(function(line) {
                          var info = line.replace(/\D/g, '');
                          var freeMem = (info / 1024).toFixed(0);
                          cb(freeMem);
                          //console.log(freeMem);
                        })
                      }
                    })

                    resolve(device.id)
                  })
                  transfer.on('error', reject)
                  transfer.pipe(fs.createWriteStream(fn))
                })
              })
          })
        })
    })
    .then(function() {

    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })
}