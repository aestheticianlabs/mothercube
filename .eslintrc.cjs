module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		// prefer tabs instead of spaces
		'no-tabs': 0,
		indent: ['error', 'tab'],
		// allow console.log
		'no-console': 0,
		// allow ++/--
		'no-plusplus': 0,
		'import/extensions': 0,
	},
};
