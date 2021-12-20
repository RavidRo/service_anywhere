module.exports = {
    root: true,
    extends: '@react-native-community',
    rules: {
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        semi: ['error', 'always', {omitLastInOneLineBlock: true}],
    },
};
