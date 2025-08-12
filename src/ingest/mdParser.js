const fs = require('fs');

function parseMarkdown(filePath, outputDir) {
    const content = fs.readFileSync(filePath, 'utf8');
    const text = content.replace(/[#*_>\[\]()`~]/g, ''); // remove markdown syntax
    const outputFileName = `${outputDir}/${getBaseName(filePath)}.txt`;
    fs.writeFileSync(outputFileName, text, 'utf8');
    console.log(`Markdown parsed → ${outputFileName}`);
}

function getBaseName(filePath) {
    return filePath.split('/').pop().split('.')[0];
}

module.exports = parseMarkdown;
