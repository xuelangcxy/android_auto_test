var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var fs = require('fs');
var lineReader = require('line-reader');

module.exports = function(cb) {
  client.listDevices()
    .then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.shell(device.id, 'dumpsys window windows | grep "Display: init" > /sdcard/autotest/displayinfo.txt')
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
            return client.pull(device.id, '/sdcard/autotest/displayinfo.txt')
              .then(function(transfer) {
                return new Promise(function(resolve, reject) {
                  var fn = './tmp/' + 'displayinfo.txt'
                  transfer.on('progress', function(stats) {
                    //   console.log('[%s] Pulled %d bytes so far', device.id, stats.bytesTransferred)
                  })
                  transfer.on('end', function() {
                    // console.log('[%s] Pull complete', device.id)
                    lineReader.open('./tmp/displayinfo.txt', function(reader) {
                      if (!reader.hasNextLine()) {
                        cb(0);
                      };
                      if (reader.hasNextLine()) {
                        reader.nextLine(function(line) {
                          var i = 0;
                          var display = '';
                          while (line[i] != '=') {
                            i++
                          };
                          while (line[i] != ' ') {
                            display = display + line[i + 1];
                            i++;
                          }

                          cb(display);
                          //cb(720*1280);
                          //console.log(display);
                        })
                      }
                      //cb(0);
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