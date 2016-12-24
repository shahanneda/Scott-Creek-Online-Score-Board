
//Needs Express and socket io
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var homeScore 
var guestScore  ;
var foulshome ;
var foulsguest ;
var timeoutsguest ;
var timeoutshome ;
var period ;
var time ;
var isUnderMin;


var hiddenFields = [];

function setDefaults(){
	 homeScore = '0';
	 guestScore  = '0';
	 foulshome = '0';
	 foulsguest ='0';
	 timeoutsguest = '0';
	 timeoutshome = '0';
	 period = '0';
	 time = 0;
	 isUnderMin;
	 hiddenFields.forEach(function(data){
	 	data.isVisible = true;
	 });

	 
}
setDefaults();
io.on('connection', function(socket){
		io.emit('start');
		AllEmit();


		function AllEmit(){
			io.emit('HomeScoreChange', homeScore);
			io.emit('GuestScoreChange', guestScore);
			io.emit('GuestTimeoutChange', timeoutsguest);
			io.emit('HomeTimeoutChange', timeoutshome);
			io.emit('GuestFoulChange', foulsguest);
			io.emit('HomeFoulChange', foulshome);
			io.emit('PeriodChange', period);
			io.emit('TimeChange', time);

			hiddenFields.forEach(function(data){
				io.emit('toggleField',data);

			});
				
			

		}	
		socket.on('toggleField', function(data){
				
				var alreadyExists = false;

			  	for (var i = 0, len = hiddenFields.length; i < len; i++) {
			  		try{
			  			if(hiddenFields[i].elementClass == data.elementClass){
 							hiddenFields.splice(i,1);
 							alreadyExists = false;
 						}
			  		} catch(err){


			  		}
 						
 										
				}
				if(!alreadyExists ){
					  hiddenFields.push(data);
				}
			  io.emit('toggleField',data);
			 
			    
			    
				

			
			
		});

		socket.on('ping', function() {
    		socket.emit('pong');
  		});

		socket.on('HomeScoreChange', function(newScore){
			io.emit('HomeScoreChange', newScore);
			homeScore= newScore;
			
	    	
	 	});
	
		socket.on('GuestScoreChange', function(newScore){
			io.emit('GuestScoreChange', newScore);
			guestScore = newScore;
			 	
		}); 
		
		//FOULS
		socket.on('GuestFoulChange', function(newScore){
			io.emit('GuestFoulChange', newScore);
			foulsguest = newScore;   	
		});

		socket.on('HomeFoulChange', function(newScore){
			io.emit('HomeFoulChange', newScore);
			foulshome = newScore;   	
		});
		//TIMEOUTS
		socket.on('HomeTimeoutChange', function(newScore){
			io.emit('HomeTimeoutChange', newScore);
			timeoutshome = newScore;   	
		});
		socket.on('GuestTimeoutChange', function(newScore){
			io.emit('GuestTimeoutChange', newScore);
			timeoutsguest = newScore;   	
		});
		//PERIOD
		socket.on('PeriodChange', function(newScore){
			io.emit('PeriodChange', newScore);
			period = newScore;   	
		});
		//TIME
		socket.on("TimePlay", function(newtime){
			io.emit("TimePlay", newtime);
			time=newtime;
		});
		socket.on('TimePause' , function(newtime){
			io.emit("TimePause", newtime);
			time=newtime;
		});
		socket.on('TimeChange' , function(newtime){
			io.emit("TimeChange", newtime);
			time = newtime;
		});
		socket.on('SeparatorChange', function(newIsUnderMin){
			io.emit('SeparatorChange', newIsUnderMin);
		    isUnderMin = newIsUnderMin;
		});
				
		socket.on('reset', function(){
			setDefaults();
			AllEmit();

		});


});


setInterval(function(){
	if(Math.floor(time - 10) <= 0){time = 0}else{
		time = time - 10;
	}
	
}, 10);


// CONVERT MILLISECONDS TO DIGITAL CLOCK FORMAT
function convertMillisecondsToDigitalClock(ms) {
    var hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
    var minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    var seconds = Math.floor(((ms % 360000) % 60000) / 1000) ;
    var tenthseconds = Math.floor((((ms % 360000) % 60000) % 1000) / 100);// 1 Second = 1000 Milliseconds
    var miliseconds = (((ms % 360000) % 60000) % 1000);
        return {
        hours : hours,
        minutes : minutes,
        seconds : seconds,
        miliseconds:miliseconds,
        tenthseconds: tenthseconds,
        clock : hours + ":" + minutes + ":" + seconds + "." + tenthseconds
    	};
}


