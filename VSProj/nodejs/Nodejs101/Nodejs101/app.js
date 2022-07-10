'use strict';

// object literals
var objLiterals = {
    njing: 'asu',
    fak: [
        {
            kam: 'pret'
        },
        {
            kam: 'bing'
        },
        {
            jir: 'lah'
        }]
};

console.log(objLiterals.njing);
console.log(objLiterals.fak);
console.log(objLiterals.fak[0]);
console.log(objLiterals.fak[2]);
console.log(objLiterals.fak[1].kam);
console.log(objLiterals.fak[2].jir);
console.log(objLiterals.fak[2].kam); // result: undefined

// functions
function normal() {
    return 'abc';
}
console.log(normal());

function undefined() { }
console.log(undefined());

// immediate function
(function immediate() {
    console.log('this is from immediate');
})();

var tes = 123;
if (true) {
    (function () { // create new scope
        var tes = 456;
        console.log(tes);
    })();
}
console.log(tes);

// anonymous function
var anon = function () {
    console.log('from anonymous function');
}
anon();

// higher order function : pass functions to other functions
setTimeout(function () { // send anonymous function to setTimeout function as a param
    console.log('2000 milliseconds have passed');
}, 2000);

function sto() {
    console.log('2000 milliseconds have passed');
}
setTimeout(sto, 2000);

// closures
function outerFunc(arg) {
    var accessThis = arg;

    function someFunc() {
        console.log(accessThis); // access a variable from outer scope
    }

    // local func has access to arg
    someFunc();
}
outerFunc('closures....');

function outerFunc2(arg) {
    var accessThis = arg;
    return function () {
        console.log(accessThis);
    };
}
var innerFunc = outerFunc2('closures 2.....');
innerFunc();

// nodejs performance
// long operation
// simulate web request
function longRunningOperation(callback) {
    setTimeout(callback, 3000);
}

function webRequest(request) {
    console.log('start long op for request: ', request.id);
    longRunningOperation(function () {
        console.log('end ope for request: ', request.id);
    });
}

webRequest({ id: 1 });
webRequest({ id: 2 });

//////////////////////////////////////////////////////////////////

console.log('Hello Node from VS!');
