const gulp = require('gulp');
const webpack = require('webpack-stream');
const webserver = require('gulp-webserver');

const path = {
	WASM: ['./assembly/*.ts', './assembly/**/*.ts'],
	DEMO: ['./src/*.js', './src/**/*.js', './src/*.vue', './src/**/*.vue'],
	DEMO_STATIC: ['./src/index.html', '../dist/main.wa*'],
	DEMO_DIST: './dist',
};

gulp.task('demo_static', function () {
	return gulp.src(path.DEMO_STATIC).pipe(gulp.dest(path.DEMO_DIST));
});

gulp.task('demo_js', function () {
	return gulp
		.src(path.DEMO)
		.pipe(
			webpack({
				config: require('./webpack.config.js'),
			})
		)
		.pipe(gulp.dest(path.DEMO_DIST));
});

gulp.task('demo_webserver', function () {
	gulp.src(path.DEMO_DIST).pipe(
		webserver({
			host: '127.0.0.1',
			port: 6639,
			livereload: true,
			open: true,
			fallback: './index.html',
		})
	);
});

if (process.env.dev) {
	gulp.watch(path.DEMO, gulp.parallel('demo_static', 'demo_js'));
	gulp.task('default', gulp.series('demo_js', 'demo_static', 'demo_webserver'));
} else {
	gulp.task('default', gulp.series('demo_js', 'demo_static'));
}
