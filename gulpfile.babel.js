import gulp from 'gulp';

// ----- Plugins -----

import {deleteSync as del} from 'del';
import pug from 'gulp-pug';

// ----- Routes -----

const routes = {
	pug: {
		src: 'src/*.pug',
		dest: 'build'
	}
}

// ----- Tasks -----

const clear = async () => {
	del(['build']);
};

const prepare = gulp.series([clear]);

// ---

const pug_compile = async () => {
	return gulp.src(routes.pug.src)
	.pipe(pug())
	.pipe(gulp.dest(routes.pug.dest));
}

const assets = gulp.series([pug_compile]);

// ---

export const dev = gulp.series([
	prepare,
	assets
]);