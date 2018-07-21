var sqlite3 = require('sqlite3').verbose();
// DB 경로 지정
var DB_PATH = __dirname + "/db/handymenu.sqlite";
// 데이터 베이스 연결
var db = new sqlite3.Database(DB_PATH);


var selectValue = function (condition) {
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.get('select meal FROM HANDYMENU WHERE days = ? AND meal = ? and kcal <> 0',
        { $days: '2018-07-19', $meal: '아침' },
        function (err, res) {
          if (err) return reject(err);

          resolve(res);
      });
    });
  });
};


// 検索してなんかする処理
var condition = {
  days  : '2018-07-19',
	meal  : '아침'
};

selectValue(condition).then(function (result) {
  console.log('Success:', result.menu);
}).catch(function (err) {
  console.log('Failure:', err);
});
