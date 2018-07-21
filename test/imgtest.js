const express = require('express');

var app = express();
var fs = require('fs');

fs.readFile(__dirname+'/crawl_data/2018_7_12.txt', 'utf8', function(err, data) {
    console.log(data);
	if (err) { console.log("error -> "+err); return; }
});

/*
app.use(express.static('crawl_data'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});


// About page route
app.get('/about', function (req, res) {
  res.send('About this wiki')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); */

