// 모듈 로드
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

// URL 지정
var url = "https://ko-kr.facebook.com/ottimofood/";
var param = {};

function crawl_start(str) {
    //금일 날짜 추출
    client.fetch(url, param, function(err, $, res) {
        if (err) {
            console.log("error");
            return;
        }
        var isexit = false;
        var today = new Date();
        var year = today.getFullYear();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0
        var today_crawl = mm + "/" + dd;
        var today_crawl_month = mm;
        var today_crawl_day = dd;
        var today_image_name = "";
        var today_text_name = "";

        if(str == 'jungsik'){
          today_image_name = year + "_" + mm + "_" + dd + "_jungsik.jpg";
          today_text_name = year + "_" + mm + "_" + dd + "_jungsik.txt";
        }else{
          today_image_name = year + "_" + mm + "_" + dd + "_suksik.jpg";
          today_text_name = year + "_" + mm + "_" + dd + "_suksik.txt";
        }

        console.log("today_crawl--> " + today_crawl);

        // 링크를 추출하여 표시
        $("p").each(function(idx) {
            if (isexit) return;

            var text = $(this).text();
            var check_crawl = text.startsWith(today_crawl);
            var check_crawl_month = text.indexOf(today_crawl_month);
            var check_crawl_day = text.indexOf(today_crawl_day);
            var check_crawl_month_day =  check_crawl_month + check_crawl_day;
            console.log("check_crawl_month--> " + check_crawl_month);
            console.log("check_crawl_day--> " + check_crawl_day);
            console.log("check_crawl_month_day--> " + check_crawl_month_day);

            var check_str = "";

            //텍스트 내용 다듬기
            if(str == 'jungsik'){
              //중식 뒤의 스페이스를 정확히 \n 으로 치환, 중식뒤에 스페이스 2자리까지는 치환가능
              if(text.indexOf("중식  ") > -1){
                  text = text.replace('중식  ','오띠모푸드 (중식)'+'\n');
              }else if(text.indexOf("중식 ") > -1){
                  text = text.replace('중식 ','오띠모푸드 (중식)'+'\n');
              }else if(text.indexOf("중식") > -1){
                  text = text.replace('중식','오띠모푸드 (중식)'+'\n');
              }else{
                  text = text.replace('중식','오띠모푸드 (중식)'+'\n');
              }
              check_str = text.indexOf('중식');
            }else{
              //석식 뒤의 스페이스를 정확히 \n 으로 치환, 석식뒤에 스페이스 2자리까지는 치환가능
              if(text.indexOf("석식  ") > -1){
                  text = text.replace('석식  ','오띠모푸드 (석식)'+'\n');
              }else if(text.indexOf("석식 ") > -1){
                  text = text.replace('석식 ','오띠모푸드 (석식)'+'\n');
              }else if(text.indexOf("석식") > -1){
                  text = text.replace('석식','오띠모푸드 (석식)'+'\n');
              }else{
                  text = text.replace('석식','오띠모푸드 (석식)'+'\n');
              }
              check_str = text.indexOf('석식');
            }
            text = text.replace('...',' ');
            //텍스트 파일생성
            if ( (check_crawl || check_crawl_month_day > 0 ) && check_str > -1) {
                fs.writeFile(savedir + "/" + today_text_name, text, 'utf8', function(error) {
                    console.log(savedir + "/" + today_text_name + ' text write end')
                });
                //이미지 파일생성
                client.fetch(url, param, function(err, $, res) {
                    if (err) {
                        console.log("error -> " + err);
                        return;
                    }

                    var list = $(".mtm img");
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
            } else {
                console.log('오늘 날짜' + today_crawl +'의 '+ str + ' 오띠모푸드 데이터가 없습니다.');
                isexit = true;
                return false;
            }
        });
    });
}

//월요일에서 금요일 11:00 - 12:59 까지 1분단위로 오띠모푸드 사이트 크롤링 (중식메뉴)
cron.schedule('*/1 11-12 * * 1-5', function() {
    crawl_start('jungsik');
    console.log('info', 'crawl_ottimofood--jungsik--Every 1 minute between the hours of 11:00-15:59 on Mon-Fri -->' + new Date());
});

//월요일에서 금요일 17:00 - 19:59 까지 1분단위로 오띠모푸드 사이트 크롤링 (석식메뉴)
cron.schedule('*/1 17-19 * * 1-5', function() {
    crawl_start('suksik');
    console.log('info', 'crawl_ottimofood--suksik--Every 1 minute between the hours of 17:00-19:59 on Mon-Fri -->' + new Date());
});
console.log("crawl_ottimo start---------" + new Date());
