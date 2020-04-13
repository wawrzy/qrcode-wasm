const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

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
							appendTsxSuffixTo: [/\.vue$/]
						}
					}
				]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
		],
	},
	plugins: [new VueLoaderPlugin()],
	entry: path.resolve(__dirname, 'src/main.ts'),
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js',
	},
}
