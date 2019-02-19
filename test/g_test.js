var a = '채소볶음밥, 크림스프, 하와이안햄버거스테이크, *계란후라이, 오이피클, 계란후라이, 오이피클, 포기김치, 328Kcal';
var b = a.substring(0, a.lastIndexOf(', '));
console.log('b-->'+b);
var c_kcal = a.substring(a.lastIndexOf(', ') + 1);
console.log('ckal-->'+c_kcal);
