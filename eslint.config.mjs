import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vueLint from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';

// const localRules = require('eslint-plugin-local-rules')
import localRules from 'eslint-plugin-local-rules';
console.log('localRules', localRules);
export default tseslint.config(
    { plugins: { 'local-rules': localRules } },

    // config parsers
    {
        files: ['*.vue', '**/*.vue', '*.ts', '**/*.ts'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // config envs
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },

    // syntax rules
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...vueLint.configs['flat/recommended'],
    // localRules.configs.all,

    // code style rules
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
    }),

    {
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/html-indent': [
                'error',
                4,
                {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true,
                    ignores: [],
                },
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: 3,
                    multiline: 1,
                },
            ],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@typescript-eslint/no-unused-expressions': 'off',
            'object-curly-newline': ['error', {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 3,
                },
                ObjectPattern: { multiline: true },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
                ExportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
            }],
            'object-property-newline': 'error',
            'object-shorthand': 'error',
            'vue/singleline-html-element-content-newline': ['warn', { ignores: ['pre', 'textarea'] }],
            'vue/multiline-html-element-content-newline': ['warn', { ignores: ['pre', 'textarea'] }],
            'prefer-const': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            'arrow-body-style': ['error'],
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: false },
            ],
            'local-rules/prefer-true-attribute-shorthand': ['error', 'always'],
            // 'local-rules/add-vue-extension': 'error',
            // 'local-rules/use-shortest-alias': 'error',
            // 'local-rules/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
        },
    },

    // overrides rules
    {
        files: ['**/*.{js,mjs,json,json5,jsonc,vue}'],
        extends: [tseslint.configs.disableTypeChecked],
    },

    {
        files: ['*.vue', '**/*.vue'],
        rules: {
            'indent': 'off',
            'vue/match-component-file-name': [
                'error',
                {
                    extensions: ['vue'],
                    shouldMatchCase: false,
                },
            ],
        },
    },

    {
        files: ['**/*.{json,json5,jsonc}'],
        rules: {
            '@stylistic/quote-props': 'off',
            '@stylistic/quotes': 'off',
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/semi': ['error', 'never'],
        },
    },

    // {
    //     files: ['*.json', '*.json5', '*.jsonc'],
    //     parser: 'jsonc-eslint-parser',
    //     rules: { 'jsonc/comma-dangle': 'error' },
    // },
);