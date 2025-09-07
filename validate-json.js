const fs = require('fs');

try {
  const content = fs.readFileSync('./data/detailed-problems.json', 'utf8');
  console.log('File length:', content.length);
  
  // Try to parse the JSON
  JSON.parse(content);
  console.log('JSON is valid!');
} catch (error) {
  console.log('JSON parsing error:', error.message);
  
  // Extract position from error message
  const positionMatch = error.message.match(/position (\d+)/);
  if (positionMatch) {
    const position = parseInt(positionMatch[1]);
    console.log('Error position:', position);
    
    // Show context around the error
    const start = Math.max(0, position - 50);
    const end = Math.min(content.length, position + 50);
    const context = content.substring(start, end);
    
    console.log('Context around error:');
    console.log(JSON.stringify(context));
    console.log('Character codes around error:');
    for (let i = Math.max(0, position - 5); i < Math.min(content.length, position + 5); i++) {
      console.log(`Position ${i}: '${content[i]}' (code: ${content.charCodeAt(i)})`);
    }
  }
}
