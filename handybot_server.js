const express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('crawl_data'));
app.use(express.static('img'));

// DB 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/db";
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}

// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

var today_text_name = "";
var today_ottimo_message = "";
var today_image_name = "";
var ottimo_text = "";
var today_image_url = "";
var today_wellstory_day = "";

//금일날짜 확인 및 셋팅 함수
function setToday(str) {
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var dayOfWeek = new Date().getDay();
    todayLabel = week[dayOfWeek];

    if (str == 'ottimo') {
        var today = new Date();
        var dd = today.getDate();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;

        today_text_name = year + "_" + mm + "_" + dd + ".txt";
        today_ottimo_message = year + "/" + mm + "/" + dd + " (" + todayLabel + ") (중식)";
        today_image_name = year + "_" + mm + "_" + dd + ".jpg";
    } else {
        var today = new Date();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;
        mm = (mm < 10) ? '0' + mm : mm;
        var dd = today.getDate();
        dd = (dd < 10) ? '0' + dd : dd;
        today_wellstory_day = year + "-" + mm + "-" + dd;
    }
};

//웰스토리 아침메뉴를 db 에서 셀렉트
function dbSelectBreakfast(callback) {
    let sql = 'SELECT id,days,course,meal,menu,kcal FROM HANDYMENU WHERE days = ? AND meal = ? and kcal <> 0 ';
    db.serialize(function() {
        var chk_cnt = 0;
        var wellstory_head = "";
        var res_object = "";
        var wellstory_text = "";
        var return_str = "\n";
        // 데이터 조회
        db.all(sql, [today_wellstory_day, '아침'], function(err, row) {
            wellstory_head = today_wellstory_day + " (" + todayLabel + ")" + " 웰스토리 아침 메뉴";

            if (todayLabel == '토' || todayLabel == '일') {
                wellstory_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
            } else {
                if (row == "") {
                    wellstory_text = "아직 메뉴가 준비되지 않았습니다.";
                } else {
                    row.forEach(function(row) {
                        if (chk_cnt > 0) {
                            wellstory_head = "";
                            return_str = "\n\n";
                        };
                        wellstory_text = wellstory_head + wellstory_text + return_str + "<" + row.course + "> " + "\n" + row.menu + "\n(칼로리:" + row.kcal + "Kcal)";
                        chk_cnt++;
                    });
                }
            }
            res_object = {
                "message": {
                    "text": wellstory_text
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["오띠모푸드", "삼성웰스토리"]
                }
            };
            callback(res_object);
            chk_cnt++;
        });
    });
};

//웰스토리 점심메뉴를 db 에서 셀렉트
function dbSelectLunch(callback) {
    let sql = 'SELECT id,days,course,meal,menu,kcal FROM HANDYMENU WHERE days = ? AND meal = ? and kcal <> 0 ';
    db.serialize(function() {
        var chk_cnt = 0;
        var wellstory_head = "";
        var res_object = "";
        var wellstory_text = "";
        var return_str = "\n";
        // 데이터 조회
        db.all(sql, [today_wellstory_day, '점심'], function(err, row) {
            wellstory_head = today_wellstory_day + " (" + todayLabel + ")" + " 웰스토리 점심 메뉴";
            if (todayLabel == '토' || todayLabel == '일') {
                wellstory_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
            } else {
                if (row == "") {
                    wellstory_text = "아직 메뉴가 준비되지 않았습니다.";
                } else {
                    row.forEach(function(row) {
                        if (chk_cnt > 0) {
                            wellstory_head = "";
                            return_str = "\n\n";
                        };
                        wellstory_text = wellstory_head + wellstory_text + return_str + "<" + row.course + "> " + "\n" + row.menu + "\n(칼로리:" + row.kcal + "Kcal)";
                        chk_cnt++;
                    });
                }
            }
            res_object = {
                "message": {
                    "text": wellstory_text
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["오띠모푸드", "삼성웰스토리"]
                }
            };
            callback(res_object);
            chk_cnt++;
        });
    });
};

//웰스토리 저녁메뉴를 db 에서 셀렉트
function dbSelectDinner(callback) {
    let sql = 'SELECT id,days,course,meal,menu,kcal FROM HANDYMENU WHERE days = ? AND meal = ? and kcal <> 0 ';
    db.serialize(function() {
        var chk_cnt = 0;
        var wellstory_head = "";
        var res_object = "";
        var wellstory_text = "";
        var return_str = "\n";
        // 데이터 조회
        db.all(sql, [today_wellstory_day, '저녁'], function(err, row) {
            wellstory_head = today_wellstory_day + " (" + todayLabel + ")" + " 웰스토리 저녁 메뉴";
            if (todayLabel == '토' || todayLabel == '일') {
                wellstory_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
            } else {
                if (row == "") {
                    wellstory_text = "아직 메뉴가 준비되지 않았습니다.";
                } else {
                    row.forEach(function(row) {
                        if (chk_cnt > 0) {
                            wellstory_head = "";
                            return_str = "\n\n";
                        };
                        wellstory_text = wellstory_head + wellstory_text + return_str + "<" + row.course + "> " + "\n" + row.menu + "\n(칼로리:" + row.kcal + "Kcal)";
                        chk_cnt++;
                    });
                }
            }
            res_object = {
                "message": {
                    "text": wellstory_text
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["오띠모푸드", "삼성웰스토리"]
                }
            };
            callback(res_object);
            chk_cnt++;
        });
    });
};

//Kakao API 연계를 위한 키보드 구현
app.get('/keyboard', function(req, res) {
    const menu = {
        type: 'buttons',
        buttons: ["오띠모푸드", "삼성웰스토리"]
    };
    res.set({
        'content-type': 'application/json; charset=euc-kr'
    }).send(JSON.stringify(menu));
});

//Kakao API 연계를 위한 메시지 구현
app.post('/message', function(req, res) {
    const _obj = {
        // 현재 들어온 유저의 key 나중에 kakao api 를 통해서 유저 정보를 얻을때 사용
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };

    var res_object;
    var otimo_text;
    var today = new Date();

    if (_obj.type == "text") {
        if (_obj.content == "오띠모푸드") {
            setToday('ottimo');

            fs.readFile(__dirname + '/crawl_data/' + today_text_name, 'utf-8', function(error, data) {
                if (error) {
                    if (todayLabel == '토' || todayLabel == '일') {
                        ottimo_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                        today_image_url = "http://13.209.234.250:3000/holyday.jpg";
                    } else {
                        ottimo_text = '아직 ' + today_ottimo_message + " 메뉴가 공지되지 않았습니다. 오띠모푸드 중식 메뉴는 오전 11:00 ~ 12:00 사이에 업데이트 됩니다.";
                        today_image_url = "http://13.209.234.250:3000/no_menu.jpg";
                    }
                } else {
                    ottimo_text = data;
                    today_image_url = "http://13.209.234.250:3000/" + today_image_name;
                }
            });
            console.log(today + ' 오띠모푸드 클릭->' + _obj.user_key + '    img-->' + today_image_url);

            res_object = {
                "message": {
                    "text": ottimo_text,
                    "photo": {
                        "url": today_image_url,
                        "width": 720,
                        "height": 630
                    },
                    "message_button": {
                        "label": "확대사진 입니다.",
                        "url": today_image_url
                    }
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["오띠모푸드", "삼성웰스토리"]
                }
            };
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(res_object));
        }

        if (_obj.content == "삼성웰스토리") {
            console.log(today + ' 삼성웰스토리 클릭->' + _obj.user_key);
            setToday('wellstory');

            res_object = {
                "message": {
                    "text": '어느 시간대의 메뉴가 궁금하세요?'
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["아침 메뉴", "점심 메뉴", "저녁 메뉴"]
                }
            };
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(res_object));
        }
        if (_obj.content == "아침 메뉴") {
            dbSelectBreakfast(function(msg) {
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(msg));
            });
        }
        if (_obj.content == "점심 메뉴") {
            dbSelectLunch(function(msg) {
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(msg));
            });
        }
        if (_obj.content == "저녁 메뉴") {
            dbSelectDinner(function(msg) {
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(msg));
            });
        }
    }


});

app.listen(3000, function() {
    console.log('HandyMenu Bot Server on port 3000!!!');
});
