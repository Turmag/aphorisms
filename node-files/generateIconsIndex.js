import {
    appendFile,
    open,
    readdir,
} from 'fs';

const generateIconsIndex = () => {
    let fileContent = '';
    const globPath = '/src/assets/icons';
    const filePath = `.${globPath}/index.ts`;

    readdir(`.${globPath}`, function (error, files) {
        if (error) throw error;

        for (let file of files) {
            if (!file.includes('.vue')) continue;

            file = file.replace(globPath, '');
            fileContent += `export { default as ${file.replace('./', '').replace('.vue', '')} } from './${file}';\n`;
        }

        open(filePath, 'w', error => {
            if (error) throw error;
        });

        appendFile(filePath, fileContent, error => {
            if (error) throw error;
        });
    });
};

generateIconsIndex();
