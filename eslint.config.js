import { aliases } from './aliases.js';
import pluginOxlint from 'eslint-plugin-oxlint';
import config from 'turmag-eslint-config';

export default [
    ...config,
    ...pluginOxlint.configs['flat/recommended'],

    {
        rules: {
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
        },
    },
];
