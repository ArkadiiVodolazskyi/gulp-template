import gulp from 'gulp';

// ----- Plugins -----

import pug from 'gulp-pug'; // https://www.npmjs.com/package/gulp-pug

// ----- Routes -----

const routes = {
	pug: {
		src: 'src/*.pug',
		dest: 'build'
	}
}

// ----- Tasks -----

export const cpug = () => {

	gulp.src(routes.pug.src) // https://gulpjs.com/docs/en/api/src
	.pipe(pug())
	.pipe(gulp.dest(routes.pug.dest)) // https://gulpjs.com/docs/en/api/dest

}

export const dev = async () => {
	console.log('Dev command executed');

	gulp.series([cpug]); // https://gulpjs.com/docs/en/api/series
}