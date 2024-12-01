import config from 'turmag-eslint-config';
import specialRules from 'eslint-plugin-turmag-special-rules';
import { aliases } from './aliases.mjs';

export default [
    { plugins: { 'special-rules': specialRules } },

    ...config,

    {
        rules: {
            'special-rules/prefer-true-attribute-shorthand': ['error', 'always'],
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
            'special-rules/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
            'special-rules/import-right-order': 'off',
        },
    },
];
