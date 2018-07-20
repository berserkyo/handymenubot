// 모듈 로드
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');
var sqlite3 = require('sqlite3').verbose();

// DB 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/db"; // --- (※1)
if (!fs.existsSync(savedir)) {    // --- (※2)
  fs.mkdirSync(savedir);          // --- (※3)
}
// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

function dbInsert(days, course, meal, menu){
  db.serialize(function () {
    // SQL실행하여 테이블 생성
    db.run('CREATE TABLE IF NOT EXISTS TEST21(id INTEGER PRIMARY KEY, days TEXT, course TEXT, meal TEXT, menu TEXT)');
    // PreparedStatement로 데이터 삽입
    var stmt = db.prepare('INSERT INTO TEST21(days, course, meal, menu) VALUES(?,?,?,?)');
    stmt.run([days, course, meal, menu]);
    stmt.finalize();


    /*
    // 데이터 조회
    db.each("SELECT * FROM TEST21", function (err, row) {
      console.log(row.id + ":" + row.days + ":" + row.course + ":" + row.meal + ":" + row.menu);
    });*/

  });
};

function dbSelect(){
  db.serialize(function () {
    // 데이터 조회
    db.each("SELECT days,course,meal,menu FROM TEST21", function (err, row) {
      console.log(row.days + ":" + row.course + ":" + row.meal + ":" + row.menu);
    });
  });
};

function setDBcoulum(){
  var c_days = "";
  var c_course = "";
  var c_meal = "";
  var c_menu = "";
  var c_meal = "";
};

// URL 지정
var url = "http://www.samsungwelstory.com/mywelstory/restaurant/weekMenu_shop.jsp?shop_no=A0042766";
var param = {};

//금일 날짜 추출
client.fetch(url, param, function(err, $, res) {
  if (err) { console.log("error"); return; }
  setDBcoulum();
  var c_meal_list = new Array('아침', '점심', '저녁', '야식/간식');

  //days 날짜취득
  $("#content_body > form.form_member01 div.wrap_weeksearch > span").each(function(idx){
    var temp = $(this).text().split('~');
    c_days = temp[0];
    console.log("스크랩 시작 날짜->"+c_days);
  });

  //월요일 식당 리스트 & 메뉴 추출
	var course_list_mon = $("tr.tr_1 > td.bg");
  course_list_mon.each(function(idx){
    //console.log(idx + " : course --> "+ $(this).text());
    c_course = $(this).text();

    $("#tbodyList > tr.tr_1 > td").each(function (idx){
      c_meal = c_meal_list[idx];
      c_menu = $(this).text().replace(/\s/gi, "");
      console.log('idx-->'+idx+ " c_days-->"+c_days+"    c_course-->"+ c_course+"   c_meal-->"+c_meal + "    c_menu--->"+c_menu );
    });

    $("#tbodyList > tr.tr_1 > td > ul > li").each(function (idx){
        //console.log(cnt + 'course-->'+ c_course +" : menu --> "+ $(this).text());
        c_menu = $(this).text();

/*
        $("#tbodyList > tr:nth-child(1) > td > ul > li").each(function(idx){
              console.log('idx-->'+idx+ " c_days-->"+c_days+"    c_course-->"+ c_course+"   c_meal-->"+c_meal + "    c_menu--->"+ $(this).text() );
        });
*/
        c_menu = c_menu.replace(/\s/gi, "");
    //console.log('idx-->'+idx+ " c_days-->"+c_days+"    c_course-->"+ c_course+"   c_meal-->"+c_meal + "    c_menu--->"+c_menu );
        //$("#tbodyList > tr:nth-child(1) > td > ul > li").each(function (idx){
        //dbInsert(c_days, c_course, c_meal, c_menu);
        //dbSelect();
    });
  });

    $("tr.tr_1 ul.foodlist li").each(function (idx){

      var temp = $(this).text();
      var tems = temp.replace(/\s/gi, "");
      //console.log('log-->'+ tems);
    });


  var menu_list_mon = $("tr.tr_1 > td.bg");
  menu_list_mon.each(function(idx){
    //console.log(idx + " : "+ $(this).text());
  });

/*
  //월요일 메뉴 리스트
  var menu_list_mon = $("tr.tr_1 > td > ul.foodlist");
  menu_list_mon.each(function(idx){
    console.log(idx + " : "+ $(this).text());
  });
*/
  /*
  //화요일 식당 리스트
	var course_list_tues = $("tr.tr_2 > td.bg");
  course_list_tues.each(function(idx){
    console.log(idx + " : "+ $(this).text());
  });

  //수요일 식당 리스트
	var course_list_wed = $("tr.tr_3 > td.bg");
  course_list_wed.each(function(idx){
    console.log(idx + " : "+ $(this).text());
  });

  //목요일 식당 리스트
	var course_list_thur = $("tr.tr_4 > td.bg");
  course_list_thur.each(function(idx){
    console.log(idx + " : "+ $(this).text());
  });

  //금요일 식당 리스트
	var course_list_fri = $("tr.tr_5 > td.bg");
  course_list_fri.each(function(idx){
    console.log(idx + " : "+ $(this).text());
  });
*/
db.close();
});
