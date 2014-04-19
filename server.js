
var OpenROVCamera = require('./lib/camera-mock')

var camera = new OpenROVCamera({delay : 1});
camera.capture();

