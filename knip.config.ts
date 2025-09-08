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
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const result = readConfigFile('tsconfig.json', sys.readFile);

        if (result.error) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            throw new Error(`Failed to read tsconfig.json: ${result.error.messageText}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
