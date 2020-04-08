const gulp = require('gulp')
const webpack = require('webpack-stream')
const webserver = require('gulp-webserver')

const path = {
	WASM: ['./assembly/*.ts', './assembly/**/*.ts'],
	DEMO: [
		'./demo/src/*.js',
		'./demo/src/**/*.js',
		'./demo/src/*.vue',
		'./demo/src/**/*.vue',
	],
	DEMO_STATIC: ['./demo/src/index.html', './build/wasm/*'],
	DEMO_DIST: './demo/dist',
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
			'../../build/wasm/main.wasm',
			'--textFile',
			'../../build/wasm/main.wat',
			'--sourceMap',
			'--measure',
			'--importMemory',
			'--runtime',
			'full',
			'--optimize',
		],
		callback
	)
})

gulp.task('demo_static', function () {
	return gulp.src(path.DEMO_STATIC).pipe(gulp.dest(path.DEMO_DIST))
})

gulp.task('demo_js', function () {
	return gulp
		.src(path.DEMO)
		.pipe(
			webpack({
				config: require('./demo/webpack.config.js'),
			})
		)
		.pipe(gulp.dest(path.DEMO_DIST))
})

gulp.task('demo_webserver', function () {
	gulp.src(path.DEMO_DIST).pipe(
		webserver({
			host: '127.0.0.1',
			port: 6639,
			livereload: true,
			open: true,
			fallback: './index.html',
		})
	)
})

gulp.watch(path.DEMO, gulp.parallel('demo_static', 'demo_js'))
gulp.watch(path.WASM, gulp.series('wasm', 'demo_static'))

gulp.task(
	'default',
	gulp.series('demo_js', 'wasm', 'demo_static', 'demo_webserver')
)
