const fs = require('fs');

function parseText(filePath, outputDir) {
    const content = fs.readFileSync(filePath, 'utf8');
    const outputFileName = `${outputDir}/${getBaseName(filePath)}.txt`;
    fs.writeFileSync(outputFileName, content, 'utf8');
    console.log(`Text file copied → ${outputFileName}`);
}

function getBaseName(filePath) {
    return filePath.split('/').pop().split('.')[0];
}

module.exports = parseText;
