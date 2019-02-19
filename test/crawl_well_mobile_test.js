//http://112.106.28.115/menu_today.do?toDay=20190218&meal_type=1&view_type=LIST

var TARGET_URL = "http://112.106.28.115/login_simple.do";

var casper = require('casper').create();

var fs = require('fs');

console.log('==1==');
console.log('한글');
function getTodayCount(){
    return document.querySelector('#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(3)').innerText;
}



casper.start(TARGET_URL, function() {
  /*this.page.customHeaders = {
    "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,;q=0.8",
    //"Accept-Language": "en-US,en;q=0.5",
    //"Accept-Encoding": "gzip, deflate",
    //"Connection" : "keep-alive"
  //}*/
  /*
  this.page.customHeaders = {
   "Accept-Encoding": "utf-8"
 }*/
  //this.echo(casper.getTitle());
  console.log(casper.getTitle());
  //this.echo(response.headers.get('Date'));
  var side_today_count = this.evaluate(getTodayCount);
  console.log("오늘의 방문자 수 : " + side_today_count);
  console.log("wellstory site opened");
  //casper.thenClick('#sex_m');
});

//casper.thenClick('#sex_m');
//casper.wait(100);

casper.then(function(){
  var getComment = function(){
    return document.querySelector("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(3)").innerText;
  };
  console.log("test --> : " + this.evaluate(getComment));

  fs.write("casper.txt",this.evaluate(getComment), 'w');

  console.log("ID 와 PW로 로그인 처리합니다.");

  this.click("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type='checkbox']:nth-child(2)");

  this.evaluate(function(){
      document.getElementById("name").value = "황제원";
      document.getElementById("phone").value = "01035260793";
      //document.getElementById("birth").value = "790817";
      $('#birth').val("790817");
      //document.querySelector("input[type='checkbox'][id=sex_m]").checked = true;
      //this.clickLabel('남자', 'label');

      //$('#sex_m').prop("checked", true);
      //casper.Click('#sex_m');
      //document.getElementById('sex_m').checked;
      //this.click('#sex_m');
      //document.getElementById("sex_m").checked;
      //$("input:checkbox[id='sex_m']").prop("checked", true); /* by ID */
      //$('#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type="checkbox"]:nth-child(2)').prop("checked",true);
      //casper.thenClick('#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type="checkbox"]:nth-child(2)');
      //$('#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type="checkbox"]:nth-child(7)').prop("checked",true);
      //$('#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type="checkbox"]:nth-child(12)').prop("checked",true);

      //$("input:checkbox").prop("checked", true);
      //document.querySelector("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type='checkbox']:nth-child(2)").checked = true;
      //capser.click("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > input[type='checkbox']:nth-child(2)");
      $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.sex_checkbox > label:nth-child(3)").trigger('click');
      $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(3)").trigger('click');
      $("#wrap > div.intro_wrap > div.int_login > div.login_checkbox.article_checkbox > form > label:nth-child(8)").trigger('click');

      $("#wrap > div.intro_wrap > div.int_login > button").trigger('click');
  });

}
  );

casper.then(function(){
  console.log("로그인처리");
  console.log("1초 후에 AfterLogin.png 으로 저장됩니다.");
    this.wait(1000, function(){
      this.capture('AfterLogin.png');
      //fs.write("test.html", this.getHTML(), "w")
      console.log("AfterLogin.png 생성");
      //casper.capture("screenshot.jpg");
    });
});

casper.then(function(){
  console.log("페이지이동");
  this.evaluate(function(){
    var temp = 20190222;
    location.href = '/menu_today.do?toDay='+temp+'&meal_type=1&view_type=LIST';
  });
    this.wait(1000, function(){
      this.capture('AfterLogin_morning.png');
      console.log("AfterLogin_morning.png 생성");
      /*
      var n = this.getElementsInfo('#breakfast > li').length;
      console.log('n-->'+n);
      for(var i=1; i<=n ; i++){
        var krResult = function(i){
            var temp = document.querySelector('#breakfast > li:nth-child('+i+') > a > div.logo > div').innerText;
            return temp;
        }
        var result = this.evaluate(krResult, i);
        console.log(i+"--morning restaurant-->" + result);
      }

      var m = this.getElementsInfo('#breakfast > li').length;
      console.log('m-->'+m);
      for(var i=1; i<=m ; i++){
        var krResult = function(i){
            var temp = document.querySelector('#breakfast > li:nth-child('+i+') > a > div.menu_text').innerText;
            return temp;
        }
        var result = this.evaluate(krResult, i);
        console.log(i+"--morning menu-->" + result);
      }*/

      var n = this.getElementsInfo('#breakfast > li').length;
      console.log('n-->'+n);
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
            menutop_str = "2월 18일 웰스토리 아침메뉴";
        }else{
            menutop_str = "";
        }
        //console.log('fs.workingDirectory -> ', fs.workingDirectory);
        //console.log('fs.absolute(./) -> ', fs.absolute('./'));
        fs.write("well_morning.txt",menutop_str + '\n' + resultR + '\n' +resultM, 'a+');
      }

      //#breakfast > li:nth-child(1)

      //#breakfast > li:nth-child(1) > a > div.menu_text
      //#breakfast > li:nth-child(2) > a > div.menu_text
/*
      var getComment = function(){
        return document.querySelector("#breakfast > li:nth-child(1) > a > div.logo > div").innerText;
      };
      console.log("morning -->" + this.evaluate(getComment));
*/

      //#breakfast > li:nth-child(1) > a > div.logo > div
      //#breakfast > li:nth-child(2) > a > div.logo > div

      //fs.write("test.html", this.getHTML(), "w")
      //casper.capture("screenshot.jpg");
    });
});

casper.run();
