//pm2 에서는 pm2 start crawl_wellstory.js 로 실행할수 없다
//(casperjs 가 있는 소스라서 실행을 casperjs crawl_wellstory.js 로 해야함)
//따라서 node 로 실행하기 위해 이 소스를 만듬
var casperProcess = (process.platform === "win32" ? "casperjs.cmd" : "casperjs");
var spawn = require("child_process").spawn;
var child = spawn(casperProcess, ["crawl_wellstory.js"]);

console.log('casperProcess-->'+casperProcess);
console.log('crawl_wellstory.js source start!!');

child.stdout.on("data", function (data) {
	console.log(String(data));
});
child.stderr.on("data", function (data) {
	console.log("spawnSTDERR:", JSON.stringify(data))
});

child.on("exit", function (code) {
	console.log("spawnEXIT:", code)
});
