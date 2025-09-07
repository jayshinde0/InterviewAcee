const fs = require('fs');

// Read the JSON file
let content = fs.readFileSync('data/detailed-problems.json', 'utf8');

// Fix all unescaped quotes in explanations
content = content.replace(/"explanation": "([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
  return `"explanation": "${p1}\\"${p2}\\"${p3}"`;
});

// Fix any remaining unescaped quotes in explanations
content = content.replace(/"explanation": "([^"]*)"([^"]*)"/g, (match, p1, p2) => {
  return `"explanation": "${p1}\\"${p2}"`;
});

// Fix quotes in descriptions
content = content.replace(/"description": "([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
  return `"description": "${p1}\\"${p2}\\"${p3}"`;
});

// Fix quotes in input/output examples
content = content.replace(/"input": "([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
  return `"input": "${p1}\\"${p2}\\"${p3}"`;
});

content = content.replace(/"output": "([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
  return `"output": "${p1}\\"${p2}\\"${p3}"`;
});

// Fix any remaining problematic patterns
content = content.replace(/\\"([^"]*)\\"([^"]*)\\"([^"]*)\\"/g, (match, p1, p2, p3) => {
  return `\\"${p1}\\"${p2}\\"${p3}\\"`;
});

// Write the fixed content back
fs.writeFileSync('data/detailed-problems.json', content);

console.log('✅ Fixed all JSON syntax errors!');

// Validate the JSON
try {
  JSON.parse(content);
  console.log('✅ JSON is now valid!');
} catch (e) {
  console.log('❌ JSON still has errors:', e.message);
}
