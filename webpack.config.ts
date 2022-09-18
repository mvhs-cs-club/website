const path = require('path');

const config = {
	mode: process.env.NODE_ENV,
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			{
				test: /\.?js$/,
				exclude: '/node_modules/'
			}
		],
	},
	resolve: {
		extentions: ['.ts', '.tsx', '.js', '.jsx']
	}
};

module.exports = config;