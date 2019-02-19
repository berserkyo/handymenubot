const express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
//var sqlite3 = require('sqlite3').verbose();
//var dateutil = require('date-utils');

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
//var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
//var db = new sqlite3.Database(DB_PATH);

var today_text_name = "";
var today_ottimo_message = "";
var today_image_name = "";
var ottimo_text = "";
var today_image_url = "";
var today_wellstory_day = "";
var out_ottimo_text = "";
var out_today_image_url = "";

var well_text = "";
var today_well_text_name = "";
//var today_well_image_url = "";
var out_well_text = "";

var pavan_text = "";
var today_pavan_text_name = "";
var today_pavan_message = "";
var today_pavan_image_name = "";
var today_pavan_image_url = "";
var out_pavan_text = "";

//금일날짜 확인 및 셋팅 함수
function setToday(str) {
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var dayOfWeek = new Date().getDay();
    todayLabel = week[dayOfWeek];

    if (str == 'ottimoJungsik') {
        var today = new Date();
        var dd = today.getDate();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;

        //오띠모푸드 중식 설정값 셋팅
        today_text_name = year + "_" + mm + "_" + dd + "_jungsik.txt";
        today_ottimo_message = year + "/" + mm + "/" + dd + " (" + todayLabel + ") (중식)";
        today_image_name = year + "_" + mm + "_" + dd + "_jungsik.jpg";
        ottimo_text = '아직 ' + today_ottimo_message + " 메뉴가 공지되지 않았습니다. 오띠모푸드 중식 메뉴는 오전 11시 ~ 12시 사이에 업데이트 됩니다.\n식당사정에 의해 공지되지 않을수도 있습니다.";
        today_image_url = "http://13.209.234.250:3000/no_menu.jpg";
    }else if(str == 'ottimoSuksik'){
        var today = new Date();
        var dd = today.getDate();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;

        //오띠모푸드 석식 설정값 셋팅
        today_text_name = year + "_" + mm + "_" + dd + "_suksik.txt";
        today_ottimo_message = year + "/" + mm + "/" + dd + " (" + todayLabel + ") (석식)";
        today_image_name = year + "_" + mm + "_" + dd + "_suksik.jpg";
        ottimo_text = '아직 ' + today_ottimo_message + " 메뉴가 공지되지 않았습니다. 오띠모푸드 석식 메뉴는 오후 5시 ~ 6시 사이에 업데이트 됩니다.\n식당사정에 의해 공지되지 않을수도 있습니다.";
        today_image_url = "http://13.209.234.250:3000/no_menu2.jpg";
    }else if(str == 'wellstoryBreakfast'){
        var today = new Date();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;
        //mm = (mm < 10) ? '0' + mm : mm;
        var dd = today.getDate();
        //dd = (dd < 10) ? '0' + dd : dd;
        //today_wellstory_day = year + "-" + mm + "-" + dd;
        //var today_well_text_name = "";
        //var today_well_message = "";
        //var today_well_image_name = "";
        //var today_well_image_url = "";

        //파반 카페 낮 메뉴 설정값 셋팅
        today_well_text_name = year + "_" + mm + "_" + dd + "_well_breakfast_menu.txt";
        well_text = "아직 메뉴가 공지되지 않았습니다." + "\n" + "삼성 웰스토리 식당 메뉴는 \n식당사정에 의해 공지되지 않을수도 있습니다.";
        //today_well_image_url = "http://13.209.234.250:3000/no_menu.jpg";

    }else if(str == 'wellstoryLunch'){
        var today = new Date();
        var year = today.getFullYear();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();

        //파반 카페 점심 메뉴 설정값 셋팅
        today_well_text_name = year + "_" + mm + "_" + dd + "_well_lunch_menu.txt";
        well_text = "아직 메뉴가 공지되지 않았습니다." + "\n" + "삼성 웰스토리 식당 메뉴는 \n식당사정에 의해 공지되지 않을수도 있습니다.";
    }else if(str == 'wellstoryDinner'){
      var today = new Date();
      var year = today.getFullYear();
      var mm = today.getMonth() + 1;
      var dd = today.getDate();

      //파반 카페 저녁 메뉴 설정값 셋팅
      today_well_text_name = year + "_" + mm + "_" + dd + "_well_dinner_menu.txt";
      well_text = "아직 메뉴가 공지되지 않았습니다." + "\n" + "삼성 웰스토리 식당 메뉴는 \n식당사정에 의해 공지되지 않을수도 있습니다.";
    }else if(str == 'pavanMorningMenu'){
      var today = new Date();
      var dd = today.getDate();
      var year = today.getFullYear();
      var mm = today.getMonth() + 1;

      //파반 카페 아침 메뉴 설정값 셋팅
      //today_pavan_text_name = year + "_" + mm + "_" + dd + "_pavan_morning_menu.txt";
      today_pavan_message = year + "/" + mm + "/" + dd + " (" + todayLabel + ") (파반 카페 아침)";
      //today_pavan_image_name = year + "_" + mm + "_" + dd + "_pavan_morning_menu.jpg";
      if(todayLabel == '월' || todayLabel == '수' || todayLabel == '금'){
        today_pavan_text_name = "/pavan/pavan_morning_1.txt";
        today_pavan_image_name = "/pavan/pavan_morning_1.jpg";
      }else if(todayLabel == '화' || todayLabel == '목'){
        today_pavan_text_name = "/pavan/pavan_morning_2.txt";
        today_pavan_image_name = "/pavan/pavan_morning_2.jpg";
      }
      pavan_text = '아직 ' + today_pavan_message + " 메뉴가 공지되지 않았습니다. 파반 카페 아침 메뉴는 오전 9시 ~ 10시 사이에 업데이트 됩니다.\n식당사정에 의해 공지되지 않을수도 있습니다.";
      today_pavan_image_url = "http://13.209.234.250:3000/no_menu.jpg";
    }else if(str == 'pavanDayMenu'){
      var today = new Date();
      var dd = today.getDate();
      var year = today.getFullYear();
      var mm = today.getMonth() + 1;

      //파반 카페 낮 메뉴 설정값 셋팅
      today_pavan_text_name = year + "_" + mm + "_" + dd + "_pavan_day_menu.txt";
      today_pavan_message = year + "/" + mm + "/" + dd + " (" + todayLabel + ") (파반 카페 샐러드&샌드위치)";
      today_pavan_image_name = year + "_" + mm + "_" + dd + "_pavan_day_menu.jpg";
      pavan_text = '아직 ' + today_pavan_message + " 메뉴가 공지되지 않았습니다. 파반 카페 샐러드&샌드위치 메뉴는 오전 11시 ~ 12시 사이에 업데이트 됩니다.\n식당사정에 의해 공지되지 않을수도 있습니다.";
      today_pavan_image_url = "http://13.209.234.250:3000/no_menu.jpg";
    }
};

//Kakao API 연계를 위한 키보드 구현
app.get('/keyboard', function(req, res) {
    const menu = {
        type: 'buttons',
        buttons: ["오띠모푸드", "삼성웰스토리", "파반 카페"]
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
          console.log(today + '오띠모푸드 클릭->' + _obj.user_key);
          res_object = {
              "message": {
                  "text": '어느 시간대의 메뉴가 궁금하세요?'
              },
              "keyboard": {
                  "type": "buttons",
                  "buttons": ["점심 메뉴(오띠모푸드)", "저녁 메뉴(오띠모푸드)"]
              }
          };
          res.set({
              'content-type': 'application/json'
          }).send(JSON.stringify(res_object));
        }
    }

    if (_obj.type == "text") {
        if (_obj.content == "점심 메뉴(오띠모푸드)" || _obj.content == "저녁 메뉴(오띠모푸드)") {
            if (_obj.content == "점심 메뉴(오띠모푸드)"){
              setToday('ottimoJungsik');
            }else{
              setToday('ottimoSuksik');
            }

            fs.readFile(__dirname + '/crawl_data/' + today_text_name, 'utf-8', function(error, data) {
                if (error) {
                    if (todayLabel == '토' || todayLabel == '일') {
                        out_ottimo_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                        today_image_url = "http://13.209.234.250:3000/holyday.jpg";
                    } else {
                        out_ottimo_text = ottimo_text;
                    }
                } else {
                    out_ottimo_text = data;
                    today_image_url = "http://13.209.234.250:3000/" + today_image_name;
                }

                out_today_image_url = today_image_url;

                if (_obj.content == "점심 메뉴(오띠모푸드)"){
                  console.log(today + ' 점심 메뉴(오띠모푸드) 클릭->' + _obj.user_key + '    img-->' + out_today_image_url);
                }else{
                  console.log(today + ' 저녁 메뉴(오띠모푸드)->' + _obj.user_key + '    img-->' + out_today_image_url);
                }

                res_object = {
                    "message": {
                        "text": out_ottimo_text,
                        "photo": {
                            "url": out_today_image_url,
                            "width": 720,
                            "height": 630
                        },
                        "message_button": {
                            "label": "확대사진 입니다.",
                            "url": out_today_image_url
                        }
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["오띠모푸드", "삼성웰스토리", "파반 카페"]
                    }
                };
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(res_object));
            });
        }

        if (_obj.content == "삼성웰스토리") {
            console.log(today + ' 삼성웰스토리 클릭->' + _obj.user_key);

            res_object = {
                "message": {
                    "text": '어느 시간대의 메뉴가 궁금하세요?'
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["아침 메뉴(웰스토리)", "점심 메뉴(웰스토리)", "저녁 메뉴(웰스토리)"]
                }
            };
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(res_object));
        }

        if (_obj.content == "아침 메뉴(웰스토리)") {
            setToday('wellstoryBreakfast');

            console.log(today + ' 아침 메뉴(웰스토리) 클릭->' + _obj.user_key);
            fs.readFile(__dirname + '/crawl_data/' + today_well_text_name, 'utf-8', function(error, data) {
              if (error) {
                  if (todayLabel == '토' || todayLabel == '일') {
                      out_well_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                      //today_well_image_url = "http://13.209.234.250:3000/holyday.jpg";
                  } else {
                      out_well_text = well_text;
                  }
              } else {
                  out_well_text = data;
                  //today_pavan_image_url = "http://13.209.234.250:3000/" + today_pavan_image_name;
              }
              //var out_today_well_image_url = today_well_image_url;

              res_object = {
                  "message": {
                      "text": out_well_text
                  },
                  "keyboard": {
                      "type": "buttons",
                      "buttons": ["오띠모푸드", "삼성웰스토리", "파반 카페"]
                  }
              };
              res.set({
                  'content-type': 'application/json'
              }).send(JSON.stringify(res_object));

            });
        }

        if (_obj.content == "점심 메뉴(웰스토리)") {
          setToday('wellstoryLunch');

          console.log(today + ' 점심 메뉴(웰스토리) 클릭->' + _obj.user_key);
          fs.readFile(__dirname + '/crawl_data/' + today_well_text_name, 'utf-8', function(error, data) {
            if (error) {
                if (todayLabel == '토' || todayLabel == '일') {
                    out_well_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                    //today_well_image_url = "http://13.209.234.250:3000/holyday.jpg";
                } else {
                    out_well_text = well_text;
                }
            } else {
                out_well_text = data;
                //today_pavan_image_url = "http://13.209.234.250:3000/" + today_pavan_image_name;
            }
            //var out_today_well_image_url = today_well_image_url;

            res_object = {
                "message": {
                    "text": out_well_text
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["오띠모푸드", "삼성웰스토리", "파반 카페"]
                }
            };
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(res_object));


          });

        }

        if (_obj.content == "저녁 메뉴(웰스토리)") {
            setToday('wellstoryDinner');

            console.log(today + '저녁 메뉴(웰스토리) 클릭->' + _obj.user_key);
            fs.readFile(__dirname + '/crawl_data/' + today_well_text_name, 'utf-8', function(error, data) {
              if (error) {
                  if (todayLabel == '토' || todayLabel == '일') {
                      out_well_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                      //today_well_image_url = "http://13.209.234.250:3000/holyday.jpg";
                  } else {
                      out_well_text = well_text;
                  }
              } else {
                  out_well_text = data;
                  //today_pavan_image_url = "http://13.209.234.250:3000/" + today_pavan_image_name;
              }
              //var out_today_well_image_url = today_well_image_url;

              res_object = {
                  "message": {
                      "text": out_well_text
                  },
                  "keyboard": {
                      "type": "buttons",
                      "buttons": ["오띠모푸드", "삼성웰스토리", "파반 카페"]
                  }
              };
              res.set({
                  'content-type': 'application/json'
              }).send(JSON.stringify(res_object));


            });
        }

        if (_obj.content == "파반 카페") {
            console.log(today + ' 파반 카페 클릭->' + _obj.user_key);
            setToday('pavanCafe');

            res_object = {
                "message": {
                    "text": '어느 시간대의 메뉴가 궁금하세요?'
                },
                "keyboard": {
                    "type": "buttons",
                    "buttons": ["아침 메뉴(Pavan Cafe)", "오늘의 샐러드 & 샌드위치(Pavan Cafe)"]
                }
            };
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(res_object));
        }

        if (_obj.content == "아침 메뉴(Pavan Cafe)" || _obj.content == "오늘의 샐러드 & 샌드위치(Pavan Cafe)") {
            if (_obj.content == "아침 메뉴(Pavan Cafe)"){
              setToday('pavanMorningMenu');
            }else{
              setToday('pavanDayMenu');
            }
            fs.readFile(__dirname + '/crawl_data/' + today_pavan_text_name, 'utf-8', function(error, data) {
                if (error) {
                    if (todayLabel == '토' || todayLabel == '일') {
                        out_pavan_text = "주말은 식당 쉽니다." + "\n" + "월~금요일에 이용해주세요.";
                        today_pavan_image_url = "http://13.209.234.250:3000/holyday.jpg";
                    } else {
                        out_pavan_text = pavan_text;
                    }
                } else {
                    out_pavan_text = data;
                    today_pavan_image_url = "http://13.209.234.250:3000/" + today_pavan_image_name;
                }
                var out_today_pavan_image_url = today_pavan_image_url;

                if (_obj.content == "아침 메뉴(Pavan Cafe)"){
                  console.log(today + ' 아침 메뉴(Pavan Cafe) 클릭->' + _obj.user_key + '    img-->' + out_today_image_url);
                }else{
                  console.log(today + ' 오늘의 샐러드 & 샌드위치(Pavan Cafe) 클릭->' + _obj.user_key + '    img-->' + out_today_image_url);
                }

                res_object = {
                    "message": {
                        "text": out_pavan_text,
                        "photo": {
                            "url": out_today_pavan_image_url,
                            "width": 720,
                            "height": 630
                        },
                        "message_button": {
                            "label": "확대사진 입니다.",
                            "url": out_today_pavan_image_url
                        }
                    },
                    "keyboard": {
                        "type": "buttons",
                        "buttons": ["오띠모푸드", "삼성웰스토리", "파반 카페"]
                    }
                };
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(res_object));
            });
        }

    }

});

app.listen(3000, function() {
    console.log('HandyMenu Bot Server on port 3000!!!');
});
