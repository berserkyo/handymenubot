//수동으로 sqlite db 를 제어하기 위한 소스
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

// DB 저장할 디렉토리가 없으면 생성
var savedir = __dirname + "/db"; // --- (※1)
if (!fs.existsSync(savedir)) { // --- (※2)
    fs.mkdirSync(savedir); // --- (※3)
}
// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);

//테이블 조회
function dbSelect(){
  db.serialize(function () {
    db.each("SELECT id,days,course,meal,menu,kcal FROM HANDYMENU", function (err, row) {
      console.log(row.id + ":" + row.days + ":" + row.course + ":" + row.meal + ":" + row.menu + ":" + row.kcal);
    });
    console.log('SELECT id,days,course,meal,menu,kcal FROM HANDYMENU----done');
  });
};

//테이블 삭제
function dbDelete() {
    db.serialize(function() {
        db.run('delete from HANDYMENU');
    });
    console.log('delete from HANDYMENU----done');
};

var first_arg = process.argv[2];

if(first_arg == "select"){
  dbSelect();
};
if(first_arg == "delete"){
  dbDelete();
};
if(first_arg == null || (first_arg != 'select' && first_arg != 'delete') ){
  console.log('사용법(1) :  node db_control select  --> handymenu 테이블 셀렉트함' + '\n' + '사용법(2) :  node db_control delete  --> handymenu 테이블 삭제');
}
