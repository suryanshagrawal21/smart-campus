const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const inputPath = path.join('C:', 'Users', 'sriva', '.gemini', 'antigravity', 'brain', 'faa471d8-e25c-4ac6-bbf6-840e2d1f672f', 'complete_documentation.md');
const outputPath = path.join('C:', 'Users', 'sriva', '.gemini', 'antigravity', 'brain', 'faa471d8-e25c-4ac6-bbf6-840e2d1f672f', 'Campus_Issues_Documentation.pdf');

console.log('Converting markdown to PDF...');
console.log('Input:', inputPath);
console.log('Output:', outputPath);

markdownpdf({
    paperFormat: 'A4',
    paperOrientation: 'portrait',
    paperBorder: '2cm'
})
    .from(inputPath)
    .to(outputPath, function () {
        console.log('✅ PDF generated successfully!');
        console.log('📄 Location:', outputPath);
    });
