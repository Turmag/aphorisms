import { readConfigFile, sys } from 'typescript';
import type { KnipConfig } from 'knip';

interface ITsConfig {
    compilerOptions?: {
        paths?: {
            [key: string]: string[];
        };
    };
}

const getTsConfigPaths = (): Record<string, string[]> => {
    try {
        const result = readConfigFile('tsconfig.json', sys.readFile);

        if (result.error) {
            throw new Error(`Failed to read tsconfig.json: ${result.error.messageText}`);
        }

        const tsConfig: ITsConfig = result.config;

        return tsConfig.compilerOptions?.paths || {};
    } catch (error) {
        console.error('Error reading tsconfig.json:', error);
        return {};
    }
};

const config: KnipConfig = {
    project: ['./src/**/*'],
    paths: getTsConfigPaths(),
    include: ['files'],
};

export default config;
