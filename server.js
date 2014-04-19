var config 						= require('./lib/config'); 
var express 					= require('express'); 
var fs 								= require('fs'); 
var glob 							= require('glob');
var OpenROVCamera 		= require('./lib/camera')
var ECT 							= require('ect');
var ectRenderer 			= ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
var _ 								= require('underscore');
var WebSocketServer 	= require('ws').Server; 
var sys 							= require('util'); 

var camera = new OpenROVCamera({delay : 1});
// camera.capture();

var app 				= express(); 
var log 				= fs.createWriteStream(config.log.location, { flags: 'a'}); 
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use(express.logger({stream:log})); 
app.use("/static", express.static(__dirname + '/static'));
app.use(express.cookieParser()); 
// Tell express to parse POST body automagically.
app.use(express.bodyParser());

// Make it easy to extend the web-component if required, just drop in 
// modulejs-compatible files into components, and they will be picked up
// and served by express!
glob('./web/*.js', {}, function(er, files){
	_.each(files, function(file, idx){
		require(file)(app);
	});
})

app.use(app.router); 
//app.use(airbrake.expressHandler());
app.listen(config.web.port);


wss = new WebSocketServer({port: config.socket.port}); 
wss.on('connection', function(ws){

	ws.interval = setInterval(function(){
		ws.send("ping"); 
	}, 2000); 

	ws.on('close', function(){
		clearInterval(ws.interval);
	});

	ws.on('message', function(message){
		var payload = JSON.parse(message); 
		if(payload.command == "camera.on"){
			console.log("turn on"); 
			camera.capture(); 
		}else if(payload.command == "camera.off"){
			console.log("turn off"); 
			camera.close(); 
		}
	});

});