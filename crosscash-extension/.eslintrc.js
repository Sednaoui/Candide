module.exports = {
    extends: ['eslint-config-willo-react', 'plugin:@typescript-eslint/recommended', 'eslint-config-willo-base'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        /*
         * Omit the project property as it should be defined in the project itself
         * project: `${__dirname}/tsconfig.json`,
         */
        sourceType: 'module',
    },
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-use-before-define': 'off',
        'react/require-default-props': 'off',
        'no-console': 'warn',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: false,
                },
            },
        ],
        // Allow requires
        '@typescript-eslint/no-require-imports': 0,
        // Allow empty
        '@typescript-eslint/no-empty-interface': 0,
        // Override the base rule 'no-shadow' which causes false positives on Typescript
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        // Disable 'no-undef' rule which causes false positives on Typescript
        'no-undef': 'off',
        'import/extensions': [
            'error', 'ignorePackages', {
                js: 'never',
                mjs: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'max-len': ['error', 100, 2, {
            ignoreUrls: true,
        }],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.native.js', '.d.ts'],
            },
        },
    },
    plugins: [
        '@typescript-eslint',
    ],
    env: {
        jest: true,
        es6: true,
        node: true,
        browser: true,
    },
};
