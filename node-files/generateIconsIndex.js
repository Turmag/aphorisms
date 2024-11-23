const fs = require('fs');
const glob = require('glob');

function generateIconsIndex() {
    let fileContent = '';
    const filePath = './src/assets/icons/index.ts';
    const globPath = '/src/assets/icons';

    glob(`.${globPath}/*.vue`, {}, function (err, files) {
        if (err) throw err;

        files.forEach(file => {
            file = file.replace(globPath, '');
            fileContent += `export { default as ${file.replace('./', '').replace('.vue', '')} } from '${file}';\n`;
        });

        fs.open(filePath, 'w', err => {
            if (err) throw err;
        });

        fs.appendFile(filePath, fileContent, err => {
            if (err) throw err;
        });
    });
}

generateIconsIndex();
