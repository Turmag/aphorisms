import {
    open,
    appendFile,
    readdir,
} from 'fs';

const generateIconsIndex = () => {
    let fileContent = '';
    const globPath = '/src/assets/icons';
    const filePath = `.${globPath}/index.ts`;

    readdir(`.${globPath}`, function (err, files) {
        if (err) throw err;

        for (let file of files) {
            if (!file.includes('.vue')) continue;

            file = file.replace(globPath, '');
            fileContent += `export { default as ${file.replace('./', '').replace('.vue', '')} } from './${file}';\n`;
        }

        open(filePath, 'w', err => {
            if (err) throw err;
        });

        appendFile(filePath, fileContent, err => {
            if (err) throw err;
        });
    });
};

generateIconsIndex();
