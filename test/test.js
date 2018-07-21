//파일읽고 쓰기 for node.js
var fs = require('fs');


var data = 'file system example!! 여기는 한글!!! '; 
fs.writeFile('text1.txt', data, 'utf8', function(error){ 
	console.log('write end') 
	});

//console.log("읽은 파일 -->" + txt);

//fs.writeFileSync("sample.txt","한글 abc 등등~....!!!");