const fs = require('fs');
let content = fs.readFileSync('data/detailed-problems.json', 'utf8');
// Fix unescaped quotes in explanations
content = content.replace(/"explanation": "([^\"]*)\\"([^\"]*)\\"([^\"]*)"/g, '"explanation": "$1\\\\"$2\\\\"$3"');
fs.writeFileSync('data/detailed-problems.json', content);
console.log('Fixed unescaped quotes');