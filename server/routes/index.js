var express = require('express');
var router = express.Router();
var io = require("socket.io").listen(8100);
var date = new Date();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('welcome');
})

io.sockets.on("connection", function(socket) {
	console.log("Server-Client connected!" + "  " + date.toLocaleTimeString());
	socket.on("event", function(data) {

		/* GET home page. */
		/*router.get('/', function(req, res, next) {
			res.render('welcome');
		})*/


		router.get('/performance', function(req, res, next) {
			res.render('performance', {
				time: data.time,
				cpu_rate: data.cpu_rate,
				memory: data.memory,
				temperature: data.temp
			})
		});


		router.get('/terminals', function(req, res, next) {
			if (data.wlanState === 'ok') {
				res.render('terminals', {
					productModel: data.productModel,
					manufacturer: data.manufacturer,
					model_id: data.model_id,
					cpu: data.cpu,
					systemVersion: data.systemVersion,
					productIMEI: data.productIMEI,
					density: data.density,
					display: data.display,
					wlanState: "已连接",
					totalMem: data.totalMem,
					freeMem: data.freeMem,
					batteryLevel: data.batteryLevel,
					time: data.time
				});
			};
			if (data.wlanState === 'failed') {
				res.render('terminals', {
					productModel: data.productModel,
					manufacturer: data.manufacturer,
					model_id: data.model_id,
					cpu: data.cpu,
					systemVersion: data.systemVersion,
					productIMEI: data.productIMEI,
					density: data.density,
					display: data.display,
					wlanState: "已断开",
					totalMem: data.totalMem,
					freeMem: data.freeMem,
					batteryLevel: data.batteryLevel,
					time: data.time
				});
			};
		})

		router.get('/general', function(req, res, next) {
			res.render('general');
		})

		router.get('/problem', function(req, res, next) {
			res.render('problem');
		})

	})
})
module.exports = router;