var fs = require('fs');

var iconv = require('iconv-lite');

fs.writeFile("testtt.txt",'한글내용' ,'utf8', function(error) {
    console.log("/" + 'texttt.txt' + ' text write end');
});

console.log('한글');
//var content = fs.readFileSync('testtt.txt');

//var content2 = jschardet.detect(content);
//console.log(content2);
