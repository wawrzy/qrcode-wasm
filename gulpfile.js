const gulp = require('gulp');
const typescript = require('gulp-typescript');

const path = {
	WASM: ['./assembly/*.ts', './assembly/**/*.ts'],
	SRC: ['./lib/*.ts'],
	DIST: './dist',
};

/*
		For more information see: https://docs.assemblyscript.org/details
*/
gulp.task('wasm', (callback) => {
	const asc = require('assemblyscript/bin/asc');
	asc.main(
		[
			'main.ts',
			'--baseDir',
			'assembly/src',
			'--binaryFile',
			'../../dist/main.wasm',
			'--textFile',
			'../../dist/main.wat',
			'--sourceMap',
			'--measure',
			'--importMemory',
			'--runtime',
			'full',
			'--optimize',
		],
		callback
	);
});

gulp.task('lib', function () {
	return gulp
		.src(path.SRC)
		.pipe(
			typescript({
				target: 'es5',
				strict: true,
				declaration: true,
				declarationDir: './dist',
				outDir: './dist',
				module: 'es2015',
				experimentalDecorators: true,
				noImplicitAny: false,
				strictNullChecks: false,
				moduleResolution: 'node',
				lib: ['es2015', 'dom'],
			})
		)
		.pipe(gulp.dest(path.DIST));
});

if (process.env.GULP_WATCH) {
	gulp.watch(path.SRC, gulp.series('lib'));
	gulp.watch(path.WASM, gulp.series('wasm'));
}

gulp.task('default', gulp.series('lib', 'wasm'));
