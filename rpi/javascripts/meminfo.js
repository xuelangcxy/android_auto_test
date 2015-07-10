var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var fs = require('fs');
var lineReader = require('line-reader');
var packagename = "com.example.xuelang";

module.exports = function(cb) {
  client.listDevices()
    .then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.shell(device.id, 'dumpsys meminfo | grep ' + packagename + ' > /sdcard/autotest/meminfo.txt')
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
          return client.pull(device.id, '/sdcard/autotest/meminfo.txt')
            .then(function(transfer) {
              return new Promise(function(resolve, reject) {
                var fn = './tmp/' + 'meminfo.txt'
                transfer.on('progress', function(stats) {
                  //   console.log('[%s] Pulled %d bytes so far', device.id, stats.bytesTransferred)
                })
                transfer.on('end', function() {
                  // console.log('[%s] Pull complete', device.id)

                  lineReader.open('./tmp/meminfo.txt', function(reader) {
                    if (!reader.hasNextLine()) {
                      cb(0);
                    };
                    if (reader.hasNextLine()) {
                      reader.nextLine(function(line) {
                        var info = line;
                        var i;
                        var memory = '';
                        for (i = 0; i <= 10; i++) {
                          if (info[i] == '\x20') {} else if (info[i] == 'k') {
                            i = 11;
                          } else {
                            memory = memory + info[i];
                          }
                        }
                        //console.log('This is memory usage:'+a)
                        cb(memory);
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