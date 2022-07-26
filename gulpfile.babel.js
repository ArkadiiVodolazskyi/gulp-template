import gulp from 'gulp';

// ----- Plugins -----

import {deleteSync as del} from 'del';
import pug from 'gulp-pug';
import server from 'gulp-webserver'; // https://www.npmjs.com/package/gulp-webserver

// ----- Routes -----

const routes = {
	build: 'build',
	pug: {
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

// ----- Server -----

const server_settings = {
	livereload: true,
	open: true
}

const server_run = () => {
	gulp.src(routes.build)
	.pipe(server(server_settings));
}

const start = gulp.series([server_run]);

// ----- Run -----

// FIXME: build folder is not created while trying to start the server

export const dev = gulp.series([
	prepare,
	assets,
	start
]);