const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const {browsers} = require('./utils/config');

const appSrc = path.join(__dirname, 'src');
const config = {
	devtool: 'cheap-module-source-map',
	entry: {
		popup: path.join(__dirname, 'src', 'js', 'popup.js'),
		options: path.join(__dirname, 'src', 'js', 'options.js'),
		background: path.join(__dirname, 'src', 'js', 'background.js')
	},

	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: appSrc,
				enforce: 'pre',
				loader: 'xo-loader'
			},
			{
				test: /\.(js|jsx)$/,
				include: appSrc,
				loader: 'babel-loader',
				query: {
					presets: [['env', {
						targets: {browsers},
						cacheDirectory: true
					}]]
				}
			},
			{
				test: /\.css$/,
				include: appSrc,
				use: [
					'style-loader',
					'css-loader?importLoaders=1',
					'postcss-loader'
				]
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(['build']),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'popup.html'),
			filename: 'popup.html',
			chunks: ['popup']
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'options.html'),
			filename: 'options.html',
			chunks: ['options']
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'background.html'),
			filename: 'background.html',
			chunks: ['background']
		}),
		new WriteFilePlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new WebpackShellPlugin({
			onBuildEnd: ['node utils/generate-manifest.js']
		})
	]
};

module.exports = config;
