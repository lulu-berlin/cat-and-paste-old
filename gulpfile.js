var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var modernizr = require('gulp-modernizr');

gulp.task('lint', function () {
    return gulp.src('src/js/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

gulp.task('modernizr', function () {
    return gulp.src('src/js/*.js')
            .pipe(modernizr())
            .pipe(gulp.dest('build/'))
            .pipe(uglify())
            .pipe(gulp.dest('build/js'));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
            .pipe(concat('all.js'))
            .pipe(gulp.dest('build'))
            .pipe(rename('all.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);
