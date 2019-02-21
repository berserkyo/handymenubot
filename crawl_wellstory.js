//모듈 로드
var casper = require('casper').create();
var fs = require('fs');
var cron = require('node-cron');

//메뉴와 스크린샷을 저장할 디렉토리
var savedir_menu = "crawl_data/";
var savedir_screenshot = "crawl_data/wellstory/";

//접속 URL
var TARGET_URL = "http://112.106.28.115/login_simple.do";


function crawl_start() {
  var todayInfo_origin = new Date();
  var todayInfo = new Date();

  var today_param = "";
  var param_dd = "";
  var param_mm = "";

  var plus_todayLabel = "";
  var plus_year = "";
  var plus_mm = "";
  var plus_dd = "";

  var repeat_cnt = 0;

  var week = new Array('일', '월', '화', '수', '목', '금', '토');
  var dayOfWeek = new Date().getDay();
  var todayLabel = week[dayOfWeek];

  casper.start(TARGET_URL, function() {
    /*this.page.customHeaders = {
      "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,;q=0.8",
      //"Accept-Language": "en-US,en;q=0.5",
      //"Accept-Encoding": "gzip, deflate",
      //"Connection" : "keep-alive"
    //}*/
    console.log(casper.getTitle());
    console.log("wellstory site opened");
  });

  casper.then(function(){
    console.log("ID 와 PW로 로그인 처리합니다.");

    this.evaluate(function(){
        document.getElementById("name").value = "황제원";
        document.getElementById("phone").value = "01035260793";
        $('#birth').val("790817");
        $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.sex_checkbox > label:nth-child(3)").trigger('click');
        $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(3)").trigger('click');
        $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(8)").trigger('click');
        $("#wrap > div.intro_wrap > div.int_login > button").trigger('click');
    });
  });


  casper.then(function(){
    console.log("로그인 후, 스샷");
    console.log("1초 후에 AfterLogin.png 으로 저장됩니다.");

    this.wait(1000, function(){
      var tempToday_f = new Date();
      var year_f = tempToday_f.getFullYear();
      var mm_f = tempToday_f.getMonth() + 1; //January is 0
      var dd_f = tempToday_f.getDate();
      var today_file_name_f = year_f + "_" + mm_f + "_" + dd_f;
      this.capture(savedir_screenshot + today_file_name_f +'_AfterLogin.png');
      //fs.write("test.html", this.getHTML(), "w")
      console.log(savedir_screenshot + today_file_name_f + '_AfterLogin.png 생성');
    });
  });

  //월요일부터 금요일까지의 메뉴 크롤링
  casper.repeat(5, function(){
    console.log('repeat_cnt--a>'+repeat_cnt);
    if(repeat_cnt == 0){
      var tempToday = new Date();
      var year = tempToday.getFullYear();
      var mm = tempToday.getMonth() + 1; //January is 0
      var dd = tempToday.getDate();

      plus_year = year;
      plus_mm = mm;
      plus_dd = dd;

      plus_todayLabel = todayLabel;
      console.log('plus_mm===>'+plus_mm);
      console.log('plus_dd===>'+plus_dd);
    }else{
      todayInfo.setDate(todayInfo_origin.getDate() + repeat_cnt);
      plus_year = todayInfo.getFullYear();
      plus_mm = todayInfo.getMonth() + 1; //January is 0
      plus_dd = todayInfo.getDate();

      dayOfWeek = todayInfo.getDay();
      todayLabel = week[dayOfWeek];
      plus_todayLabel = todayLabel;
    }
    var today_string = plus_mm + "월 " + plus_dd + "일" + " (" + plus_todayLabel + ")";

    //월/일 한자리일때 0붙임 (달이 넘어갈때는 ??)
    if(plus_mm < 10){
      param_mm = '0' + plus_mm;
    }else{
      param_mm = plus_mm;
    }
    if(plus_dd < 10){
      param_dd = '0' + plus_dd;
    }else{
      param_dd = plus_dd;
    }
    console.log('param_mm===>'+param_mm);
    console.log('param_dd===>'+param_dd);
    today_param = plus_year + param_mm + param_dd;

    var today_file_name = plus_year + "_" + plus_mm + "_" + plus_dd;
console.log('today_string-->'+today_string);
console.log('today_param-->'+today_param);
console.log('today_file_name-->'+today_file_name);

  casper.then(function(){
    //evaluate 사용시 안쪽에 변수 전달 안됨. 또한 로그자체가 찍히지 않기 때문에 디버깅 난감함 -_-;
    /*this.evaluate(function(){
      //console.log("today_param--gg2-->"+today_param);
      location.href = '/menu_today.do?toDay=' + today_param + '&meal_type=1&view_type=LIST';
    });*/
    casper.open('http://112.106.28.115/menu_today.do?toDay='+today_param+'&meal_type=1&view_type=LIST');


    this.wait(1000, function(){
      this.capture(savedir_screenshot + today_file_name +'_breakfast.png');
      console.log(savedir_screenshot + today_file_name +'_breakfast.png 생성');

      var n = this.getElementsInfo('#breakfast > li').length;
      console.log('메뉴 갯수-->'+n);
      var menutop_str = "";

      for(var i=1; i<=n ; i++){
        var restaurant = function(i){
            var temp = document.querySelector('#breakfast > li:nth-child('+i+') > a > div.logo > div').innerText;
            return temp;
        }
        var resultR = this.evaluate(restaurant, i);

        console.log(i+"--morning restaurant-->" + resultR);

        var menu = function(i){
            var temp = document.querySelector('#breakfast > li:nth-child('+i+') > a > div.menu_text').innerText;
            return temp;
        }
        var resultM = this.evaluate(menu, i);

        console.log(i+"--morning menu-->" + resultM);
        if(i == 1){
            menutop_str = today_string +" 웰스토리 아침메뉴";
        }else{
            menutop_str = "";
        }

        //메뉴 없을시 null 을 안내문구로 치환, 메뉴있을시 제목에 < > 추가
        if(resultR == null){
          resultR = "해당시간에는" + "\n" + "준비된 메뉴가 없습니다";
          resultM = "";
        }else{
          resultR = "<"+ resultR + ">";
        }
        //마지막 메뉴는 개행문자 제거
        if(i == n){
          resultM = resultM.replace(/\s$/gi, "");
        }
        fs.write(savedir_menu + today_file_name +'_well_breakfast_menu.txt',menutop_str + '\n' + resultR + '\n' +resultM, 'a+');
      }
    });
  });

  casper.then(function(){
    console.log("점심 메뉴 페이지 이동");
    casper.open('http://112.106.28.115/menu_today.do?toDay='+today_param+'&meal_type=2&view_type=LIST');

    this.wait(1000, function(){
      this.capture(savedir_screenshot + today_file_name +'_lunch.png');
      console.log(savedir_screenshot + today_file_name +'_lunch.png 생성');

      var n = this.getElementsInfo('#lunch > li').length;
      console.log('메뉴 갯수-->'+n);
      var menutop_str = "";

      for(var i=1; i<=n ; i++){
        var restaurant = function(i){
            var temp = document.querySelector('#lunch > li:nth-child('+i+') > a > div.logo > div').innerText;
            return temp;
        }
        var resultR = this.evaluate(restaurant, i);

        console.log(i+"--lunch restaurant-->" + resultR);

        var menu = function(i){
            var temp = document.querySelector('#lunch > li:nth-child('+i+') > a > div.menu_text').innerText;
            return temp;
        }
        var resultM = this.evaluate(menu, i);

        console.log(i+"--lunch menu-->" + resultM);
        if(i == 1){
            menutop_str = today_string + " 웰스토리 점심메뉴";
        }else{
            menutop_str = "";
        }
        //메뉴 없을시 null 을 안내문구로 치환, 메뉴있을시 제목에 < > 추가
        if(resultR == null){
          resultR = "해당시간에는" + "\n" + "준비된 메뉴가 없습니다";
          resultM = "";
        }else{
          resultR = "<"+ resultR + ">";
        }
        //마지막 메뉴는 개행문자 제거
        if(i == n){
          resultM = resultM.replace(/\s$/gi, "");
        }
        fs.write(savedir_menu + today_file_name +'_well_lunch_menu.txt',menutop_str + '\n' + resultR + '\n' +resultM, 'a+');
      }
    });
  });

  casper.then(function(){
    console.log("저녁 메뉴 페이지 이동");
    casper.open('http://112.106.28.115/menu_today.do?toDay='+today_param+'&meal_type=3&view_type=LIST');

    this.wait(1000, function(){
      this.capture(savedir_screenshot + today_file_name +'_dinner.png');
      console.log(savedir_screenshot + today_file_name +'_dinner.png 생성');

      var n = this.getElementsInfo('#dinner > li').length;
      console.log('메뉴 갯수-->'+n);
      var menutop_str = "";

      for(var i=1; i<=n ; i++){
        var restaurant = function(i){
            var temp = document.querySelector('#dinner > li:nth-child('+i+') > a > div.logo > div').innerText;
            return temp;
        }
        var resultR = this.evaluate(restaurant, i);

        console.log(i+"--dinner restaurant-->" + resultR);

        var menu = function(i){
            var temp = document.querySelector('#dinner > li:nth-child('+i+') > a > div.menu_text').innerText;
            return temp;
        }
        var resultM = this.evaluate(menu, i);

        console.log(i+"--dinner menu-->" + resultM);
        if(i == 1){
            menutop_str = today_string + " 웰스토리 저녁메뉴";
        }else{
            menutop_str = "";
        }
        //메뉴 없을시 null 을 안내문구로 치환, 메뉴있을시 제목에 < > 추가
        if(resultR == null){
          resultR = "해당시간에는" + "\n" + "준비된 메뉴가 없습니다";
          resultM = "";
        }else{
          resultR = "<"+ resultR + ">";
        }
        //마지막 메뉴는 개행문자 제거
        if(i == n){
          resultM = resultM.replace(/\s$/gi, "");
        }
        fs.write(savedir_menu + today_file_name +'_well_dinner_menu.txt',menutop_str + '\n' + resultR + '\n' +resultM, 'a+');
      }
    });
  });
  console.log('repeat_cnt--b>'+repeat_cnt);
  repeat_cnt++;
  });

  casper.run();

  }

  //매주 월요일 새벽 1:11분 wellstory 사이트 크롤링
  cron.schedule('11 1 * * 1', function() {
      crawl_start();
      console.log('info', 'crawl_wellstory--mobile_site by Casperjs -- 01:11 on Monday -->' + new Date());
  });
