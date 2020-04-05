const gulp = require('gulp')
const webpack = require('webpack-stream')
const webserver = require('gulp-webserver')

const path = {
	WASM: ['./assembly/*.ts', './assembly/**/*.ts'],
	JS: ['./src/*.js', './src/**/*.js', './src/*.vue', './src/**/*.vue'],
	HTML: ['./src/index.html'],
}

/*
		For more information see: https://docs.assemblyscript.org/details
*/
gulp.task('wasm', (callback) => {
	const asc = require('assemblyscript/bin/asc')
	asc.main(
		[
			'main.ts',
			'--baseDir',
			'assembly/src',
			'--binaryFile',
			'../../dist/wasm/main.wasm',
			'--textFile',
			'../../dist/wasm/main.wat',
			'--sourceMap',
			'--measure',
			'--runtime',
			'full',
			'--optimize',
		],
		callback
	)
})

gulp.task('html', function () {
	return gulp.src(path.HTML).pipe(gulp.dest('./dist'))
})

gulp.task('js', function () {
	return gulp
		.src(path.JS)
		.pipe(
			webpack({
				config: require('./webpack.config.js'),
			})
		)
		.pipe(gulp.dest('./dist'))
})

gulp.task('webserver', function () {
	gulp.src('./dist').pipe(
		webserver({
			host: '127.0.0.1',
			port: 6639,
			livereload: true,
			open: true,
			fallback: './index.html',
		})
	)
})

gulp.watch(path.JS, gulp.series('html', 'js'))
gulp.watch(path.WASM, gulp.series('wasm'))

gulp.task('default', gulp.series('html', 'js', 'wasm', 'webserver'))
