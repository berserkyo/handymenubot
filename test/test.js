//�����а� ���� for node.js
var fs = require('fs');


var data = 'file system example!! ����� �ѱ�!!! '; 
fs.writeFile('text1.txt', data, 'utf8', function(error){ 
	console.log('write end') 
	});

//console.log("���� ���� -->" + txt);

//fs.writeFileSync("sample.txt","�ѱ� abc ���~....!!!");