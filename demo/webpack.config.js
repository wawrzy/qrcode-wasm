const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					{
						loader: 'ts-loader',
						options: {
							appendTsSuffixTo: [/\.vue$/],
							appendTsxSuffixTo: [/\.vue$/],
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: ['vue-style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			ENV: JSON.stringify(process.env.dev ? 'DEV' : 'PRODUCTION'),
		}),
	],
	entry: path.resolve(__dirname, 'src/main.ts'),
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js',
	},
};
