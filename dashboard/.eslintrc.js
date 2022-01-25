module.exports = {
	plugins: [],
	extends: ['eslint:recommended', '../.eslintrc.js'],
	env: {node: true, es6: true},
	rules: {},
	parserOptions: {
		ecmaVersion: 2017,
		browser: true,
	},
};
