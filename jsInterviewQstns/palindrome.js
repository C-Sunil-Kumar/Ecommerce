function palindrome(str) {
    function reverseString(s) {
        let reversed = '';
        for (let char of s) {
            reversed = char + reversed;
        }
        return reversed;
    }
    let cleanedStr = str.toLowerCase();
    return cleanedStr == reverseString(cleanedStr) ? 'palindrome' : 'not a palindrome';
}
console.log(palindrome("LevEl"));
