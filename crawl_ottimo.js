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

function crawl_start() {
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
        var today_image_name = year + "_" + mm + "_" + dd + ".jpg";
        var today_text_name = year + "_" + mm + "_" + dd + ".txt";
        console.log("today_crawl--> " + today_crawl);

        // 링크를 추출하여 표시
        $("p").each(function(idx) {
            if (isexit) return;

            var text = $(this).text();
            var check_crawl = text.startsWith(today_crawl);
            //텍스트 파일생성
            if (check_crawl) {
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
            } else {
                console.log('오늘 날짜' + today_crawl + '의 오띠모푸드 데이터가 없습니다.');
                isexit = true;
                return false;
            }
        });
    });
}

//월요일에서 금요일 11:00 - 12:59 까지 1분단위로 오띠모푸드 사이트 크롤링
cron.schedule('*/1 11-12 * * 1-5', function() {
    crawl_start();
    console.log('info', 'crawl_ottimofood---Every 1 minute between the hours of 11:00-12:00 on Mon-Fri -->' + new Date());
});
console.log("crawl_ottimo start---------" + new Date());
