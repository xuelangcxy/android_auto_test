var startTest = document.getElementById('btn');
var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var deviceid = 35354B5D357A00EC;

function start(){
	//alert('hello');
	//clent.shell(deviceid, 'am start -n com.example.xuelang/com.example.xuelang.MainActivity');
	client.listDevices()
		.then(function(devices) {
			return Promise.map(devices, function(device) {
					//启动一个activity
					return client.shell(device.id, 'am start -n com.example.xuelang/com.example.xuelang.MainActivity')
						.then(adb.util.readAll)
						.then(function(output) {
							console.log('[%s] %s', device.id, output.toString().trim())
						})
				})
				.then(function() {
					console.log('Activity started!')
				})
		})
}
