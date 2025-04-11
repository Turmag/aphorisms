import {
    appendFile,
    open,
    readdir,
} from 'fs';

const generateComponentsIndex = () => {
    let fileContent = '';
    const globPath = '/src/components/kit';
    const filePath = `.${globPath}/index.ts`;

    readdir(`.${globPath}`, function (error, files) {
        if (error) throw error;

        for (let file of files) {
            if (!file.includes('.vue')) continue;

            file = file.replace(globPath, '');
            const fileName = file.replace('./', '').replace('.vue', '');
            fileContent += `export { default as ${fileName} } from './${file}';\n`;
        }

        open(filePath, 'w', error => {
            if (error) throw error;
        });

        appendFile(filePath, fileContent, error => {
            if (error) throw error;
        });
    });
};

generateComponentsIndex();
