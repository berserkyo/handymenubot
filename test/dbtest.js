// 모듈 로드
var sqlite3 = require('sqlite3').verbose();
// 로컬 DB 열기
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

var temp = "";

function gg(){
  // 데이터 조회
  db.each("SELECT id,menu FROM HANDYMENU where id <= ? ",[2], function (err, row) {
    console.log(row.id + ":" + row.menu);
    temp = temp + row.menu;
    console.log('in temp-->'+temp);
    return row.menu
  });
};



// 이 API를 위한 Promise 객체를 얻는다.
var dataPromise = gg();

// 데이터가 해결됐을 때 호출될 함수를 등록한다.
dataPromise.done(function(data){
  alert("We got data: " + data);
});

// 오류 함수를 등록한다.
dataPromise.fail(function(ex){
  alert("oops, some problem occured: " + ex);
});

// 참고: 원하는 만큼 dataPromise.done(...)을 많이 가질 수 있다.
dataPromise.done(function(data){
  alert("We asked it twice, we get it twice: " + data);
});

temp = gg();
console.log('temp-->'+temp);

db.close();
