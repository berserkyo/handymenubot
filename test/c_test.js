let first = 10;
let second = 20;
let result = 0;

function add(x, y) {
  return x + y;
}

function get(content, callback){
  setTimeout(() => {
    result = add(first, second);
    console.log(result); // 30
    callback(result);
    }, 3000);
}

get('test',(result) => {
  first = 20;
  console.log('result 1--->'+result);
});

/*
function asyncTask() {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
           // 3초가 걸리는 작업
           resolve('비동기 작업 완료!');
       }, 3000);
    });
}


async function waitAsyncTask() {
    const asyncValue = await asyncTask();
    console.log(asyncValue);
}

waitAsyncTask();
*/
/*
//대표적인 콜백 처리 예제 (동기화)

let first = 10;
let second = 20;
let result = 0;

function add(x, y) {
  return x + y;
}

function getc(callback){
  setTimeout(function() {
    result = add(first, second);
    console.log(result); // 40
  }, 1000)
  return result;
}

getc(function(){
  console.log('result1---->'+result);
  first = 20;
  console.log('result2---->'+result);
});
*/
