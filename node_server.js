var express = require('express'); 
var http = require('http'); 
var app = express(); 
var server = http.createServer(app); 

app.get('/', function(req, res) { res.send('root page'); }); 

app.get('/start', function(req, res){ res.send('start page'); }); 

server.listen(3000, '192.168.33.10', function() { 
	console.log('Server listen on port ' + server.address().port); 
	});