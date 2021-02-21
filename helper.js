const fs = require('fs')
const splitLines = require('split-lines');


module.exports.hasBadWords = function(string){
    let badWords = splitLines(fs.readFileSync('bad-words.txt', 'utf8'))
    let words = string.split(' ');
    return words.some(word=>{
        return badWords.includes(word)
    })
}
 module.exports.isOld = function(msg){
    return Date.now() - msg.time.getMilliseconds() < config.TIMEOUT
}