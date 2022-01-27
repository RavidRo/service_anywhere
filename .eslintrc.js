module.exports = {
	root: true,
	plugins: [],
	extends: [],
	rules: {
		semi: ['warn', 'always', {omitLastInOneLineBlock: true}],
		indent: ['warn', 'tab', {SwitchCase: 1}],
		quotes: ['warn', 'single', {avoidEscape: true}],
		'jsx-quotes': ['warn', 'prefer-single'],
	},
	parserOptions: {
		warnOnUnsupportedTypeScriptVersion: false,
	},
};
