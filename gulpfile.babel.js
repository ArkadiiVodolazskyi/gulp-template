import gulp from 'gulp';

// ----- Plugins -----

import {deleteSync as del} from 'del';
import pug from 'gulp-pug';
import server from 'gulp-webserver';
import image from 'gulp-image';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoPrefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import browserify from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';

// TODO: use PostCSS instead of gulp-autoprefixer: https://github.com/postcss/autoprefixer#gulp

// ----- Routes -----

const routes = {
	build: 'build',
	deploy: 'build/**/*',
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
	},
	js: {
		watch: 'src/js/*.js',
		src: 'src/js/main.js',
		dest: 'build/js'
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
	.on('error', sass.logError)
	.pipe(autoPrefixer())
	.pipe(csso())
	.pipe(gulp.dest(routes.sass.dest));
}

const js_compile = () => {
	return gulp.src(routes.js.src)
	.pipe(browserify({
		transform: [babelify.configure({ presets: ['@babel/preset-env'] })]
	}))
	.pipe(gulp.dest(routes.js.dest));
}

const assets = gulp.series([pug_compile, sass_compile, js_compile]);

// ----- Watch -----

const watch_options = {
	delay: 0,
	interval: 0,
	binaryInterval: 0
}

const watch = async () => {
	gulp.watch([routes.pug.watch], watch_options, pug_compile);
	gulp.watch([routes.sass.watch], watch_options, sass_compile);
	gulp.watch([routes.js.watch], watch_options, js_compile);
}

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

export const build = gulp.series([
	prepare,
	assets
]);

export const dev = gulp.series([
	build,
	start
]);

// ----- Deploy -----

const raw_deploy = () => {
	return gulp.src(routes.deploy)
	.pipe(ghPages());
}

export const deploy = gulp.series([
	build,
	raw_deploy
]);