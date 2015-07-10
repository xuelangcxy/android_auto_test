module.exports = function(cb){
		var date = new Date();
		var year = date.getFullYear();  
	    var month = date.getMonth()+1;  
	    var day = date.getDate();  
	    var hour = date.getHours();  
	    var minute = date.getMinutes();  
	    var second = date.getSeconds(); 
	    var milliseconds = date.getMilliseconds();
	    var randomnum = Math.floor(Math.random()*100);
	    var strmonth = "";
	    var strhour = "";
	    var strday = "";
	    var strminute = "";
	    var strsecond = "";
	    if(month < 10){
	    	strmonth = "0";
	    }
	    if(day < 10){
	    	strday = "0";
	    }
	    if(hour < 10){
	    	strhour = "0";
	    }
	    if(minute < 10){
	    	strminute = "0";
	    }
	    if(second < 10){
	    	strsecond = "0";
	    }
	    var formattime = year + "-" + strmonth + "" + month + "-" + strday + "" + day + "  " + strhour +""+ hour + ":" + strminute +""+ minute + ":" + strsecond +""+ second + "  ";
	    //return formattime;
	    //return date.toLocaleString();
	    var time = formattime;
	    cb(time);
	}