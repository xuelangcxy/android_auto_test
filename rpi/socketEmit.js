var io = require("socket.io-client")('http://192.168.1.100:8100'); // This is a client connecting to the SERVER 2

var batteryTemp = require('./javascripts/batteryinfo');
var cpuOccupancyRate = require('./javascripts/cpuinfo');
var memoryOccupancyRate = require('./javascripts/meminfo');
var getCurrentTime = require('./javascripts/time');
var getProductModel = require('./javascripts/productModel');
var getSystemVersion = require('./javascripts/systemVersion');
var getProductIMEI = require('./javascripts/getProductIMEI');
var getCPU = require('./javascripts/getCPU');
var getDisplay = require('./javascripts/displayinfo');
var getWlanState = require('./javascripts/getWlanState');
var getManufacturer = require('./javascripts/getManufacturer');
var getModelID = require('./javascripts/getModelID');
var getScreenDensity = require('./javascripts/getScreenDensity');
var getTotalMem = require('./javascripts/totalMem');
var getFreeMem = require('./javascripts/freeMem');
var getBatteryLevel = require('./javascripts/batteryLevel');


console.log("Server is listening port 8100!");

var io = require("socket.io-client")('http://192.168.1.100:8100');
io.on('connect', function(socket) {
	console.log("A client has connected to this Server");
	getCurrentTime(function(time) {
		console.log(time);
		getProductModel(function(productModel) {
			getSystemVersion(function(systemVersion) {
				getProductIMEI(function(productIMEI) {
					getCPU(function(cpu) {
						getDisplay(function(display) {
							getManufacturer(function(manufacturer) {
								getModelID(function(model_id) {
									getScreenDensity(function(density) {
										getTotalMem(function(totalMem) {
											getFreeMem(function(freeMem) {
												getBatteryLevel(function(batteryLevel) {
													getWlanState(function(wlanState) {
														cpuOccupancyRate(function(cpu_rate) {
															memoryOccupancyRate(function(memory) {
																batteryTemp(function(temp) {
																	io.emit('event', {
																		time: time,
																		productModel: productModel,
																		systemVersion: systemVersion,
																		productIMEI: productIMEI,
																		cpu: cpu,
																		display: display,
																		manufacturer: manufacturer,
																		model_id: model_id,
																		density: density,
																		totalMem: totalMem,
																		freeMem: freeMem,
																		batteryLevel: batteryLevel,
																		wlanState: wlanState,
																		cpu_rate: cpu_rate,
																		memory: memory,
																		temp: temp
																	});
																	console.log("time: " + time);
																	console.log("productModel: " + productModel);
																	console.log("systemVersion: " + systemVersion);
																	console.log("productIMEI: " + productIMEI);
																	console.log("cpu: " + cpu);
																	console.log("display: " + display);
																	console.log("manufacturer: " + manufacturer);
																	console.log("model_id: " + model_id);
																	console.log("density: " + density);
																	console.log("totalMem: " + totalMem);
																	console.log("freeMem: " + freeMem);
																	console.log("batteryLevel: " + batteryLevel);
																	console.log("wlanState: " + wlanState);
																	console.log("cpu_rate: " + cpu_rate);
																	console.log("memory: " + memory);
																	console.log("temp: " + temp);
																})
															})
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	})
})