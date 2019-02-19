var dateutil = require('date-utils');

dateutil = new Date();
var time = dateutil.toFormat('HH24:MI');

if(time >= '23:08' && time <= '23:10'){
  console.log('23:08 ~10');
}else{
  console.log('else');
}
console.log('time--->'+time);

var str = '8/13 석식';
var str2 = '8/13석식';
if(str == '8/13 석식1'){
  console.log('안');
}else{
  console.log('밖');
}

var temp = str.replace('중식','dkdkdkdk');
console.log('temp-->'+temp);

var chk = str.startsWith('석식');
console.log('chk-->'+chk);
var chk2 = str.startsWith('8/13');
console.log('chk2-->'+chk2);

var chk3 = str.indexOf('8');
var chk4 = str.indexOf('13');
console.log('chk3-->'+chk3);
console.log('chk4-->'+chk4);
