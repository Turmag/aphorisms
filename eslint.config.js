import { aliases } from './aliases.js';
import config from 'turmag-eslint-config';

export default [
    ...config,

    {
        rules: {
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
        },
    },
];
