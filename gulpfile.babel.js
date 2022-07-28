import gulp from 'gulp';

// ----- Plugins -----

import {deleteSync as del} from 'del';
import pug from 'gulp-pug';
import server from 'gulp-webserver';
import image from 'gulp-image';
import dartSass from 'sass';
import gulpSass from 'gulp-sass'; // https://www.npmjs.com/package/gulp-sass
const sass = gulpSass(dartSass);

// ----- Routes -----

const routes = {
	build: 'build',
	pug: {
		watch: 'src/**/*.pug',
		src: 'src/*.pug',
		dest: 'build'
	},
	img: {
		src: 'src/img/*',
		dest: 'build/img'
	},
	sass: {
		watch: 'src/sass/*.sass',
		src: 'src/sass/**/*.sass',
		dest: 'build/css'
	}
}

// ----- Prepare -----

const clear = resolve => {
	del([routes.build]);
	resolve();
};

const img = async () => {
	gulp.src(routes.img.src)
	.pipe(image())
	.pipe(gulp.dest(routes.img.dest));
}

const prepare = gulp.series([clear, img]);

// ----- Compile -----

const pug_compile = () => {
	return gulp.src(routes.pug.src)
	.pipe(pug())
	.pipe(gulp.dest(routes.pug.dest));
}

const sass_compile = () => {
	return gulp.src(routes.sass.src)
	.pipe(sass())
	.pipe(gulp.dest(routes.sass.dest));
}

const assets = gulp.series([pug_compile, sass_compile]);

// ----- Watch -----

const watch_options = {
	delay: 0,
	interval: 0,
	binaryInterval: 0
}

const watch_pug = async () => {
	return gulp.watch([routes.pug.watch], watch_options, pug_compile);
}

const watch_sass = async () => {
	return gulp.watch([routes.sass.watch], watch_options, sass_compile);
}

const watch = gulp.parallel([
	watch_pug,
	watch_sass
]);

// ----- Server -----

const server_settings = {
	livereload: true,
	open: true
}

const server_run = () => {
	gulp.src(routes.build)
	.pipe(server(server_settings));
}

const start = gulp.parallel([
	server_run,
	watch
]);

// ----- Run -----

export const dev = gulp.series([
	prepare,
	assets,
	start
]);