const {browsers} = require('./utils/config');

module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers
		})
	]
};
