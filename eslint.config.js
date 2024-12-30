import config from 'turmag-eslint-config';
import { aliases } from './aliases.js';

export default [
    ...config,

    {
        rules: {
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
        },
    },
];
