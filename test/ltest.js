var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

// DB 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/db"; // --- (※1)
if (!fs.existsSync(savedir)) {    // --- (※2)
  fs.mkdirSync(savedir);          // --- (※3)
}
// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

var today_text_name = "";
var today_ottimo_message = "";
var today_image_name = "";

var wellstory_text = "";
var today_image_url = "";
var todayLabel = "";
var today_wellstory_day = "";

var hjw = "";

//금일날짜 확인 및 셋팅 함수
function setToday(str){
  var week = new Array('일', '월', '화', '수', '목', '금', '토');
  var dayOfWeek = new Date().getDay();
  todayLabel = week[dayOfWeek];

  if(str == 'ottimo'){
    var today = new Date();
    var dd = today.getDate();
    var year = today.getFullYear();
    var mm = today.getMonth()+1; //January is 0

    today_text_name = year+ "_" + mm + "_" + dd + ".txt";
    today_ottimo_message = year+ "/" + mm + "/" + dd+" (" + todayLabel + ") (중식)";
    today_image_name = year+ "_" + mm + "_" + dd + ".jpg";
  }else{
    var today = new Date();
    var year = today.getFullYear();
    var mm = today.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
    var dd = today.getDate(); dd = (dd < 10) ? '0' + dd : dd;
    today_wellstory_day = year+ "-" + mm + "-" + dd;
    console.log('today_wellstory_day-->'+today_wellstory_day);
  }
};

function dbSelect(callback){
  //console.log('dbSelect--start---');

  let sql = 'SELECT id,days,course,meal,menu,kcal FROM HANDYMENU WHERE days = ? AND meal = ? and kcal <> 0 ';
  db.serialize(function () {
    //console.log('today_wellstory_day-->'+today_wellstory_day);
    var chk_cnt = 0;
    var wellstory_head = "";
    var res_object = "";
    // 데이터 조회
    db.all(sql, [today_wellstory_day,'아침'], function (err, row) {
      //console.log(today_wellstory_day +" ("+todayLabel+")"+ " 웰스토리 아침 메뉴 <" + row.course + "> " + row.menu + " 음식 칼로리:" + row.kcal +"Kcal");
      wellstory_head =  today_wellstory_day +" ("+todayLabel+")" + " 웰스토리 아침 메뉴";

      //console.log('wellstory_head-->'+wellstory_head);
      if(chk_cnt > 0){
        wellstory_head = "";
      };

      row.forEach(function (row){
        wellstory_text = wellstory_head + wellstory_text +" <" + row.course + "> " + row.menu + " <br> 칼로리:" + row.kcal +"Kcal";
        console.log('wellstory_text--1>'+wellstory_text);
        chk_cnt ++;
      });

      res_object = {
      "message" : {
        "text" : wellstory_text
        },
      "keyboard" : {
        "type" : "buttons",
          "buttons" : ["오띠모푸드", "삼성웰스토리"]
        }
      };

      callback(res_object);
      chk_cnt ++;
    });
    console.log ('포문 아웃-0-->'+wellstory_text);
  });
  //console.log('dbSelect--end---');
};


setToday('wellstory');


dbSelect(function(msg){
  console.log('dbselect 호출---');
  console.log('msg--->'+msg);

});

console.log('last wellstory_text-->'+wellstory_text);
