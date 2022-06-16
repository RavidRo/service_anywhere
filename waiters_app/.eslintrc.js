module.exports = {
	extends: ['@react-native-community', '../.eslintrc.js', 'prettier'],
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
	},
	globals: {
		jest: 'readonly',
	},
};