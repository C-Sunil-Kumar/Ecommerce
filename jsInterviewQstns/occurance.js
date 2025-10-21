function occurance(str){
    let obj = {}

    for(let char of str){
        if(obj[char]){
            obj[char]++
        }
        else{
            obj[char] = 1
        
        }
    }
    return obj;
}

console.log(occurance("hello world"));