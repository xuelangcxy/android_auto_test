var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var fs = require('fs');
var lineReader = require('line-reader');
var package = "com.example.xuelang";

module.exports = function(cb) {
  client.listDevices()
    .then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.shell(device.id, 'top -n 1 | grep ' + package + ' > /sdcard/autotest/cpuinfo.txt')
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
            return client.pull(device.id, '/sdcard/autotest/cpuinfo.txt')
              .then(function(transfer) {
                return new Promise(function(resolve, reject) {
                  var fn = './tmp/' + 'cpuinfo.txt'
                  transfer.on('progress', function(stats) {
                    //   console.log('[%s] Pulled %d bytes so far', device.id, stats.bytesTransferred)
                  })
                  transfer.on('end', function() {
                    // console.log('[%s] Pull complete', device.id)

                    //保存CPU占用率信息后，从中取出占用率数值
                    lineReader.open('./tmp/cpuinfo.txt', function(reader) {
                      if (!reader.hasNextLine()) {
                        cb(0);
                      };
                      if (reader.hasNextLine()) {
                        reader.nextLine(function(line) {
                          var info = line;

                          var re = /^[0-9]+[0-9]*]*$/;
                          var i;
                          var cpu = '';
                          for (i = 10; i <= 12; i++) {
                            if (re.test(info[i])) {
                              cpu = cpu + info[i];
                            }
                          }

                          //console.log(cpu);
                          cb(cpu)
                            //console.log('CPU usage:'+a+'%')
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