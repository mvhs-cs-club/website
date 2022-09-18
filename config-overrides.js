const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
	alias({
		'components': 'src/components',
		'assets': 'src/assets',
		'keyframes': 'src/components/keyframes',
		'pages': 'src/pages',
		'types': 'src/types',
		'utils': 'src/utils',
		'contexts': 'src/contexts',
		'theme': 'src/theme',
		'hooks': 'src/hooks',
	})(config);

	return config;
};
