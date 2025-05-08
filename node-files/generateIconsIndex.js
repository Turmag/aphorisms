import {
    appendFile,
    open,
    readdir,
} from 'fs';

const toKebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const generateIconsIndex = () => {
    let fileContent = '';
    const globPath = '/src/assets/icons';
    const filePath = `.${globPath}/index.ts`;
    let exportObject = 'export default {\n';

    readdir(`.${globPath}`, function (error, files) {
        if (error) throw error;

        for (let file of files) {
            if (!file.includes('.vue')) continue;

            file = file.replace(globPath, '');
            const fileName = file.replace('./', '').replace('.vue', '');
            fileContent += `import ${fileName} from './${file}';\n`;
            const kebabFilename = toKebabCase(fileName);
            exportObject += `    ${kebabFilename.includes('-') ? '\'' : ''}${kebabFilename}${kebabFilename.includes('-') ? '\'' : ''}: ${fileName},\n`;
        }

        exportObject += '};\n';
        fileContent += '\n';
        fileContent += exportObject;

        open(filePath, 'w', error => {
            if (error) throw error;
        });

        appendFile(filePath, fileContent, error => {
            if (error) throw error;
        });
    });
};

generateIconsIndex();
