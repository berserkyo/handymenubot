var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');
var cron = require('node-cron');

// 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/crawl_data";
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}

var url = "https://blog.naver.com/PostList.nhn?blogId=rmfpxpf12&widgetTypeCall=true&directAccess=true";
var param = {};

function crawl_start() {
  client.fetch(url, param, function(err, $, res, body) {
      if (err) {
          console.log("error");
          return;
      }
      var isexit = false;
      var todayInfo = new Date();
      var year = todayInfo.getFullYear();
      var dd = todayInfo.getDate();
      var mm = todayInfo.getMonth() + 1; //January is 0
      var today_string = mm + "월" + dd;

      var today_crawl_month = mm;
      var today_crawl_day = dd;
      var today_image_name = "";
      var today_text_name = "";
      var check_crawl_total = false;
      var menu_text;

      today_image_name = year + "_" + mm + "_" + dd + "_pavan_day_menu.jpg";
      today_text_name = year + "_" + mm + "_" + dd + "_pavan_day_menu.txt";

      //제목 크롤링
      $("div > div > div.pcol1").each(function(idx) {
        if(isexit) return;
        var check_text = $(this).text().replace(/(\s*)/g,"");
        check_crawl_total = check_text.startsWith(today_string);

        console.log("check_crawl-->"+check_crawl_total);

        menu_text = $(this).text().replace(/^\s*/,"").replace(/\s*$/,"");

        //앞뒤공백제거
        //console.log($(this).text().replace(/^\s*/,"").replace(/\s*$/,""));
        //모든공백제거
        //console.log($(this).text().replace(/(\s*)/g,""));
      });

      if(check_crawl_total){
        //메뉴 크롤링
        $("div > div > div.se-main-container").each(function(idx) {
          var tempstr = $(this).text();
          //앞뒤 공백제거
          var tempstr = tempstr.replace(/^\s*/,"").replace(/\s*$/,"");
          // << >> 엔터 변환
          tempstr = tempstr.replace(/>>/gi,">>"+"\n");
          tempstr = changeString(tempstr,tempstr.lastIndexOf("<<"),"\n\n"+"<");
          // /앞뒤의 공백제거 (공백포함한 /를 한방에 치환이 어려워, 일단 #&로 변환후 치환)
          tempstr = tempstr.replace(/\//g,"#&");
          tempstr = tempstr.replace(/#& /gi,"\n");
          tempstr = tempstr.replace(/ #&/gi,"\n");
          tempstr = tempstr.replace(/#&/gi,"\n");

          console.log(tempstr);

          if(check_crawl_total){
            //텍스트 파일생성
            fs.writeFile(savedir + "/" + today_text_name, menu_text+"\n"+tempstr, 'utf8', function(error) {
                console.log(savedir + "/" + today_text_name + ' text write end');
            });

            //이미지 파일생성
            client.fetch(url, param, function(err, $, res) {
                if (err) {
                    console.log("error -> " + err);
                    return;
                }

                var list = $("div > div > a > img");
                // img 링크 추출하여 한번만 이미지 다운로드 수행
                var cnt = 0;
                $(list).each(function(idx) {
                    if (cnt == 0) {
                        var src = $(this).attr('src');
                        // 상대경로를 절대경로로 변환
                        src = URL.resolve(url, src);
                        // 저장 파일 이름 결정
                        var fname = URL.parse(src).pathname;
                        fname = savedir + "/" + today_image_name;
                        // 다운로드
                        request(src).pipe(fs.createWriteStream(fname));
                        console.log(fname + ' image write end');
                        cnt++;
                    }
                });
            });
            isexit = true;
          }else{
            console.log('오늘 날짜' + today_string +' 의 pavan cafe 데이터가 없습니다.');
            isexit = true;
            return false;
          }
        });
      }
  });
}
//지정한 위치의 char 를 지정한 문자로 변환하여 전체문자 반환
function changeString(str, index, chr){
  if(index > str.length-1){
    return str;
  }
  return str.substr(0,index) + chr + str.substr(index+1);
}


//월요일에서 금요일 10:00 - 12:59 까지 1분단위로 파반 카페 블로그 사이트 크롤링 (샐러드 & 샌드위치)
cron.schedule('*/1 10-12 * * 1-5', function() {
    crawl_start();
    console.log('info', 'crawl_pavan cafe--salad & sandwich--Every 1 minute between the hours of 11:00-15:59 on Mon-Fri -->' + new Date());
});


console.log("crawl_pavan start---------" + new Date());
