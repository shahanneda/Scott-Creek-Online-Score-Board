'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

gulp.task('sass', function () {
	 gulp.start('minify-css');
  return gulp.src('./public/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
   
});
 



 
gulp.task('minify-css', function() {
	console.log("WAH");
  return gulp.src('./public/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/sass/**/*.scss', ['sass']);
});