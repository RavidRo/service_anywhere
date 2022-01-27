module.exports = {
	plugins: ['react'],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'../.eslintrc.js',
	],
	parser: 'babel-eslint',
	env: {node: true, es6: true, browser: true},
	rules: {
		'no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
	},
	parserOptions: {
		ecmaVersion: 2017,
		browser: true,
		sourceType: 'module',
		allowImportExportEverywhere: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
