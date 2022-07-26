import gulp from 'gulp';

// ----- Plugins -----

import {deleteSync as del} from 'del';
import pug from 'gulp-pug';
import server from 'gulp-webserver'; // https://www.npmjs.com/package/gulp-webserver

// ----- Routes -----

const routes = {
	build: 'build',
	pug: {
		watch: 'src/**/*.pug',
		src: 'src/*.pug',
		dest: 'build'
	}
}

// ----- Prepare -----

const clear = (resolve) => {
	del([routes.build]);
	resolve();
};

const prepare = gulp.series([clear]);

// ----- Compile -----

const pug_compile = () => {
	return gulp.src(routes.pug.src)
	.pipe(pug())
	.pipe(gulp.dest(routes.pug.dest));
}

const assets = gulp.series([pug_compile]);

// ----- Watch -----

// https://gulpjs.com/docs/en/api/watch
const watch = async () => {
	return gulp.watch([
		routes.pug.watch
	], {
		delay: 0,
		interval: 0,
		binaryInterval: 0
	}, pug_compile);
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

export const dev = gulp.series([
	prepare,
	assets,
	start
]);