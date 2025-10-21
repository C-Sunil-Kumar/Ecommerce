let originalString = "Hello, World!";


function revereseString(str) {
    let reverse = ''
    for (let char of str) {
        reverse = char + reverse;
    }
    return reverse;
}

console.log(revereseString(originalString));

//let reversedString = originalString.split("").reverse().join("");
//console.log(reversedString); 

/*let reversedString = '';
for (let i = 0; i < originalString.length; i++) {
    reversedString = originalString[i] + reversedString;
}
console.log(reversedString);*/