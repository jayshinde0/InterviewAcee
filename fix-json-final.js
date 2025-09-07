const fs = require('fs');

// Read the JSON file
let content = fs.readFileSync('data/detailed-problems.json', 'utf8');

// Fix newlines in descriptions and explanations
content = content.replace(/\n/g, '\\n');

// Fix any remaining unescaped quotes
content = content.replace(/([^\\])"([^":])/g, '$1\\"$2');

// Fix quotes at the beginning of strings
content = content.replace(/^"([^"]*)"([^"]*)"([^"]*)"$/gm, '"$1\\"$2\\"$3"');

// Write the fixed content back
fs.writeFileSync('data/detailed-problems.json', content);

console.log('✅ Fixed JSON syntax errors!');

// Validate the JSON
try {
  JSON.parse(content);
  console.log('✅ JSON is now valid!');
} catch (e) {
  console.log('❌ JSON still has errors:', e.message);
  console.log('Error position:', e.message.match(/position (\d+)/)?.[1]);
}
