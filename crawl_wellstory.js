// 모듈 로드
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');
var sqlite3 = require('sqlite3').verbose();
var cron = require('node-cron');

// DB 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/db";
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}
// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

var today = new Date();
var year = today.getFullYear();
var mm = today.getMonth() + 1;
mm = (mm < 10) ? '0' + mm : mm;
var dd = today.getDate();
dd = (dd < 10) ? '0' + dd : dd;
today_wellstory_day = year + "-" + mm + "-" + dd;

//크롤링 데이터를 테이블에 입력
function dbInsert(days, course, meal, menu, kcal) {
    db.serialize(function() {
        // SQL실행하여 테이블 생성
        db.run('CREATE TABLE IF NOT EXISTS HANDYMENU(id INTEGER PRIMARY KEY, days TEXT, course TEXT, meal TEXT, menu TEXT, kcal INTEGER)');
        // PreparedStatement로 데이터 삽입
        var stmt = db.prepare('INSERT INTO HANDYMENU(days, course, meal, menu,kcal) VALUES(?,?,?,?,?)');
        stmt.run([days, course, meal, menu, kcal]);
        stmt.finalize();
    });
};

//이미 들어간 값이 있는지 테이블 조회 (매주 월요일 새벽 1-11 시까지 스케쥴러로 돌아감)
function dbSelectCheck() {
    db.serialize(function() {
        var sql = "SELECT id,days,course,meal,menu,kcal FROM HANDYMENU WHERE days = ? AND course = ? AND meal = ? ";
        db.all(sql, [today_wellstory_day, 'Korean', '아침'], function(err, row) {
            if (row == "") {
                console.log('들어가 있는 데이터 없음...');
                crawl_start();
                console.log('DB 입력---->'+new Date());
            } else {
                console.log('이미 데이터 들어가있음');
            }
        });
    });
};

//db 컬럼값 변수
function setDBcoulum() {
    var c_days = "";
    var c_days_origin = "";
    var c_course = "";
    var c_meal = "";
    var c_menu = "";
    var c_menu_origin = "";
    var c_kcal = "";
};

//날짜 계산 함수
function dateAddDel(sDate, nNum, type) {
    var yy = parseInt(sDate.substr(0, 4), 10);
    var mm = parseInt(sDate.substr(5, 2), 10);
    var dd = parseInt(sDate.substr(8), 10);

    if (type == "d") {
        d = new Date(yy, mm - 1, dd + nNum);
    } else if (type == "m") {
        d = new Date(yy, mm - 1 + nNum, dd);
    } else if (type == "y") {
        d = new Date(yy + nNum, mm - 1, dd);
    }

    yy = d.getFullYear();
    mm = d.getMonth() + 1;
    mm = (mm < 10) ? '0' + mm : mm;
    dd = d.getDate();
    dd = (dd < 10) ? '0' + dd : dd;

    return '' + yy + '-' + mm + '-' + dd;
}

// URL 지정
var url = "http://www.samsungwelstory.com/mywelstory/restaurant/weekMenu_shop.jsp?shop_no=A0042766";
var param = {};

function crawl_start() {
    //금일 날짜 추출
    client.fetch(url, param, function(err, $, res) {
        if (err) {
            console.log("error");
            return;
        }
        console.log("dbinsert start---");
        setDBcoulum();
        var c_meal_list = new Array('아침', '점심', '저녁', '야식/간식');

        //days 날짜취득
        $("#content_body > form.form_member01 div.wrap_weeksearch > span").each(function(idx) {
            var temp = $(this).text().split('~');
            c_days = temp[0];
            c_days_origin = c_days;
            console.log("스크랩 시작 날짜->" + c_days_origin);
        });

        for (var i = 1; i < 6; i++) {
            if (i > 1) {
                c_days = dateAddDel(c_days_origin, i - 1, 'd');
            }
            //월~금 메뉴
            $("#tbodyList > tr.tr_" + i + " > td").each(function(idx) {
                if (idx % 5 == 0) {
                    c_course = $(this).text();
                } else {
                    c_meal = c_meal_list[(idx % 5) - 1];
                    c_menu = $(this).text().replace(/^\s+|\s+$/g, '').replace(/\n/g, '$@').replace(/\s/g, '');
                    c_menu_origin = c_menu.split("$@$@").join(",");
                    c_menu = c_menu_origin.substring(0, c_menu_origin.lastIndexOf(','));
                    c_kcal = c_menu_origin.substring(c_menu_origin.lastIndexOf(',') + 1);
                    c_kcal = c_kcal.substring(0, c_kcal.lastIndexOf('K'));

                    console.log('idx-->' + idx + " c_days-->" + c_days + "    c_course-->" + c_course + "   c_meal-->" + c_meal + "    c_menu--->" + c_menu + '   c_kcal-->' + c_kcal);
                    dbInsert(c_days, c_course, c_meal, c_menu, c_kcal);
                }
            });
        }
    });
}

//매주 월요일 오전 0~11시까지 매25분마다, 1시간 단위로 11번 실행
cron.schedule('25 0-11 * * 1', function() {
    dbSelectCheck();
    console.log('info', 'crawl_wellstory---At 25 minutes past the hours between 0:00-11:00 on Mon -->' + new Date());
});

console.log("crawl_wellstory start--------- " + new Date());
//db insert 시에 db.close() 구문해놓으면 close 가 먼저 수행되기때문에 에러남.. close 처리 하지 않아도 되는듯..
//db.close();
