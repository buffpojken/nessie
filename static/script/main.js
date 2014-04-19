$(function(){

	var sock = new WebSocket("ws://"+window.location.hostname+":4001");
	console.log(sock);
	sock.onmessage = function(event){
		console.log(event.data); 
	}

	$("#camera-control").on('click', function(){
		sock.send(JSON.stringify({
			command: "camera.on"
		}));
		setTimeout(function(){
			$("#camera-feed").attr('src', "http://"+window.location.hostname+":8090/?action=stream"); 
		}, 2000); 
	});

	$("#camera-off").on('click', function(){
		sock.send(JSON.stringify({
			command: "camera.off"
		})); 
		setTimeout(function(){
			$("#camera-feed").attr('src', "/static/images/no_camera.jpg"); 
		}, 2000);
	});
});