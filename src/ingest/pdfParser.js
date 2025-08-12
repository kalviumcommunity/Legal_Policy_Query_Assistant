const fs = require('fs');
const pdfParse = require('pdf-parse');

async function parsePDF(filePath, outputDir) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const outputFileName = `${outputDir}/${getBaseName(filePath)}.txt`;
    fs.writeFileSync(outputFileName, pdfData.text, 'utf8');
    console.log(`PDF parsed → ${outputFileName}`);
}

function getBaseName(filePath) {
    return filePath.split('/').pop().split('.')[0];
}

module.exports = parsePDF;
