const express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('crawl_data'));
app.use(express.static('img'));

var today_text_name = "";
var today_ottimo_message = "";
var today_image_name = "";

var wellstory_text = "";
var today_image_url = "";

//날짜 테스트용 데이터
//today_text_name = '2018_7_17.txt';

//금일날짜 확인 및 셋팅 함수
function setToday(){
  var today = new Date();
  var dd = today.getDate();
  var year = today.getFullYear();
  var mm = today.getMonth()+1; //January is 0
  var week = new Array('일', '월', '화', '수', '목', '금', '토');
  var dayOfWeek = new Date().getDay();
  var todayLabel = week[dayOfWeek];

  today_text_name = year+ "_" + mm + "_" + dd + ".txt";
  today_ottimo_message = year+ "/" + mm + "/" + dd+" (" + todayLabel + ") (중식)";
  today_image_name = year+ "_" + mm + "_" + dd + ".jpg";
};


// About page route
app.get('/about', function (req, res) {
  res.send('About this wiki')
});

app.get('/keyboard', function (req, res) {
	const menu = {
    type: 'buttons',
    buttons: ["오띠모푸드", "삼성웰스토리"]
  };
  res.set({
      'content-type': 'application/json; charset=euc-kr'
  }).send(JSON.stringify(menu));
});


app.post('/message', function(req, res){
  const _obj = {
    // 현재 들어온 유저의 key 나중에 kakao api 를 통해서 유저 정보를 얻을때 사용
    user_key: req.body.user_key,
    type: req.body.type,
    // 눌린 버튼의 정보가 이안에 들어있음
    content: req.body.content
  };

  var res_object;
  var otimo_text;
  var today = new Date();

  if(_obj.type == "text"){
	  if(_obj.content == "오띠모푸드"){
			//wellstory_text = fs.readFileSync(__dirname+'/crawl_data/2018_7_13.txt', 'utf8');
      setToday();

      fs.readFile(__dirname+'/crawl_data/'+today_text_name, 'utf-8', function(error, data) {
        if(error){
          wellstory_text = '아직 '+ today_ottimo_message + " 메뉴가 공지되지 않았습니다. 오띠모푸드 중식 메뉴는 오전 11:00 ~ 12:00 사이에 업데이트 됩니다.";
          today_image_url = "http://13.209.234.250:3000/no_menu.jpg";
        }else{
          wellstory_text = data;
          //wellstory_text = fs.readFileSync(__dirname+'/crawl_data/2018_7_16.txt', 'utf8');
          today_image_url = "http://13.209.234.250:3000/"+today_image_name;
        }
      });
			console.log(today+' 오띠모푸드 클릭->'+_obj.user_key + '    img-->' + today_image_url);
			//console.log('wellstory_text2-->'+wellstory_text);
		  res_object = {
			"message" : {
				"text" :  wellstory_text,
				"photo" : {
					"url" : today_image_url,
					"width" : 720,
					"height" : 630
					},
          "message_button": {
            "label": "확대사진 입니다.",
            "url": today_image_url
          }
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["오띠모푸드", "삼성웰스토리"]
				}
		  };
	  }if(_obj.content == "삼성웰스토리"){
      console.log(today+' 삼성웰스토리 클릭->'+_obj.user_key);
		  res_object = {
			"message" : {
				"text" : '어느 시간대의 메뉴가 궁금하세요?'
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["아침 메뉴", "점심 메뉴", "저녁 메뉴"]
				}
			};
		}if(_obj.content == "아침 메뉴"){
		  res_object = {
			"message" : {
				"text" : '개발중입니다...빠른개발을 원하시면, 황제원 선임에게 아메리카노 한잔 사주세요 ^^'
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["오띠모푸드", "삼성웰스토리"]
				}
			};
		}if(_obj.content == "점심 메뉴"){
		  res_object = {
			"message" : {
				"text" : '개발중입니다...빠른개발을 원하시면, 황제원 선임에게 아메리카노 한잔 사주세요 ^^'
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["오띠모푸드", "삼성웰스토리"]
				}
			};
		}if(_obj.content == "저녁 메뉴"){
		  res_object = {
			"message" : {
				"text" : '개발중입니다...빠른개발을 원하시면, 황제원 선임에게 아메리카노 한잔 사주세요 ^^'
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["오띠모푸드", "삼성웰스토리"]
				}
			};
		}
  }

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(res_object));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
