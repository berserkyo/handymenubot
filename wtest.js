// 모듈 로드
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');

// 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/crawl_data/wellstory"; // --- (※1)
if (!fs.existsSync(savedir)) {    // --- (※2)
  fs.mkdirSync(savedir);          // --- (※3)
}

// URL 지정
var url = "http://www.samsungwelstory.com/mywelstory/restaurant/weekMenu_shop.jsp?shop_no=A0042766";
var param = {};

//금일 날짜 추출
client.fetch(url, param, function(err, $, res) { //----( ※ 1)
    if (err) { console.log("error"); return; }

	var today = new Date();
	var year = today.getFullYear();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0
	var today_crawl = mm + "/" + dd;
	var today_image_name = year+"_"+mm+"_"+dd+".jpg";
//today_crawl = "7/11";

	var today_text_name = year+ "_" + mm + "_" + dd + ".txt";
	console.log("today_crawl--> "+today_crawl);

  var list = $(".wrap_weekly");
		//var check_crawl = text.startsWith(today_crawl);
    list.each(function(idx) {
      $(".tr_1").each(function(idx) {
        console.log("idx1--->"+idx);
        console.log("bg1--->"+$(this).find(".bg").text());
        //console.log($(this).find(".foodlist").text());
        console.log("foodlist1--->"+$(this).find(".foodlist").text());
        //console.log("text-->"+$(this).text());
      });
      $(".tr_2").each(function(idx) {
        console.log("idx2--->"+idx);
        console.log("bg2--->"+$(this).find(".bg").text());
        console.log("foodlist2--->"+$(this).find(".foodlist").text());
      });
      $(".tr_3").each(function(idx) {
        console.log("idx3--->"+idx);
        console.log("bg3--->"+$(this).find(".bg").text());
        console.log("foodlist3--->"+$(this).find(".foodlist").text());
      });
      $(".tr_4").each(function(idx) {
        console.log("idx4--->"+idx);
        console.log("bg4--->"+$(this).find(".bg").text());
        console.log("foodlist4--->"+$(this).find(".foodlist").text());
      });
      $(".tr_5").each(function(idx) {
        console.log("idx5--->"+idx);
        console.log("bg5--->"+$(this).find(".bg").text());
        console.log("foodlist5--->"+$(this).find(".foodlist").text());
      });
  });
});
