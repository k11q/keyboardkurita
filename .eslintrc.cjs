module.exports = {
        root: true,
        parser: 'vue-eslint-parser',
        plugins: ['@typescript-eslint', 'vue'],
        extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:vue/vue3-recommended',
        ],
        parserOptions: {
                parser: "@typescript-eslint/parser",
                project: './tsconfig.json', // Add this line
                extraFileExtensions: ['.vue']
        },
        rules: {
                indent: ['error', 'tab'],
                quotes: ['error', 'single'],
                semi: ['error', 'always'],
                'no-unused-vars': 'error',
                'no-console': 'warn',
                'prefer-const': 'error',
                eqeqeq: 'error',
                'brace-style': ['error', '1tbs'],
                'vue/html-indent': ['error', 'tab'],
        },
};
