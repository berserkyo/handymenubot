const express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('crawl_data'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});


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
    // 현재 들어온 유저의 key 나중에 kakao api 를 통해서 유저 정보를 얻을때 사용해요
    user_key: req.body.user_key,
    type: req.body.type,
    // 눌린 버튼의 정보가 이안에 들어있어요!
    content: req.body.content
  };

  var res_object;
  var otimo_text;
  var wellstory_text;
  var today = new Date();

  if(_obj.type == "text"){
	  if(_obj.content == "오띠모푸드"){
			wellstory_text = fs.readFileSync(__dirname+'/crawl_data/2018_7_16.txt', 'utf8');
			console.log(today+' 오띠모푸드 클릭->'+_obj.user_key);
			//console.log('wellstory_text2-->'+wellstory_text);
		  res_object = {
			"message" : {
				"text" :  wellstory_text,
				"photo" : {
					"url" : "http://13.209.234.250:3000/2018_7_16.jpg",
					"width" : 640,
					"height" : 480
					}
				},
			"keyboard" : {
				"type" : "buttons",
			    "buttons" : ["오띠모푸드", "삼성웰스토리"]
				}
		  };
	  }if(_obj.content == "삼성웰스토리"){
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
  /*
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(
    {
      message: {
        text: _obj.content, // 텍스트로 눌린 버튼의 정보를 넘겨줍니다.
      },
      keyboard: { // 그리고 버튼들이 계속 유지되기를 원합니다.
        type: 'buttons',
        buttons: ['오띠모푸드', '삼성웰스토리']
      }
    }
  )); */
});

/*
app.post('/message', function (req, res, next) {
	const object = {
		user_key: req.body.user_key, // 메시지를 발송한 user을 식별할 수 있는 key
		type: req.body.type, // user가 보낸 message의 형태. text , photo로 이루어짐
		content: req.body.content // user가 보낸 메시지 내용.
	};
	const menus = {
		type: 'buttons',
		buttons: ["노래 추천해줘.", "네 노래로 추천해줘."]
	};

	var res_object;

	if(object.type=="text"){
		if(object.content=="노래 추천해줘."){ //4
			res_object = {
				"message": {
				"text": '조지 - boat 어때?'
				},
				"keyboard": menus
			};
		}
		else if(object.content=="네 노래로 추천해줘."){ //5
			res_object = {
				"message": {
				"text": 'Jinyo - 수면증 어때?'
				},
				"keyboard": menus
			};
		}
		else{
			res_object = {
				"message": {
				"text": object.content
				},
				"keyboard": menus
			};
		}
	}

	res.set({
      'content-type': 'application/json'
	}).send(JSON.stringify(res_object));
});
*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
