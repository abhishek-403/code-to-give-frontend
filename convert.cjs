const fs = require('fs');
const path = require('path');

// Path to the translations file
const TRANSLATIONS_FILE = path.join(process.cwd(), 'translation-mappings.json');

// Load existing translations or create empty object
let translationsMap = {};
try {
  if (fs.existsSync(TRANSLATIONS_FILE)) {
    translationsMap = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));
  }
} catch (err) {
  console.error('Error reading translation-mappings.json:', err);
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let hasChanges = false;

  root.find(j.JSXText).forEach(path => {
    const text = path.node.value.trim();
    if (text && text.length > 0 && !/^\s+$/.test(text)) {
      const key = text.toLowerCase().replace(/[^\w]+/g, '_');
      
      // Only add if this is a new translation
      if (!translationsMap[key]) {
        translationsMap[key] = text;
        hasChanges = true;
      }

      const translationCall = j.jsxExpressionContainer(
        j.callExpression(
          j.identifier('t'),
          [j.stringLiteral(key)]
        )
      );
      console.log(key)
      j(path).replaceWith(translationCall);
    }
  });

  // Only write if there were changes
  if (hasChanges) {
    try {
      fs.writeFileSync(
        TRANSLATIONS_FILE,
        JSON.stringify(translationsMap, null, 2)
      );
    } catch (err) {
      console.error('Error writing translation-mappings.json:', err);
    }
  }

  return root.toSource();
};