import gulp from 'gulp';

// ----- Plugins -----

import gpug from 'gulp-pug';

// ----- Routes -----

const routes = {
	pug: {
		src: 'src/*.pug',
		dest: 'build'
	}
}

// ----- Tasks -----

export const pug_process = async () => {
	gulp.src(routes.pug.src)
	.pipe(gpug())
	.pipe(gulp.dest(routes.pug.dest));
}

export const dev = gulp.series([pug_process]);