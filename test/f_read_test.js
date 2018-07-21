
var fs = require('fs');

var today = new Date();
var year = today.getFullYear();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0

var today_text_name = year+ "_" + mm + "_" + dd + ".txt";

console.log('today_text_name-->'+today_text_name);

today_text_name = '2018_7_13.txt';

//wellstory_text = fs.readFileSync(__dirname+'/crawl_data/'+today_text_name, 'utf8');

fs.readFile(__dirname+'/crawl_data/'+today_text_name, 'utf-8', function(error, data) {
    console.log('01 readAsync: %s',data);
    if(error){
      console.log('error-->'+error);
    }
});
