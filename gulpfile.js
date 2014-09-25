var gulp = require('gulp'),
    melchior = require('./gulp-melchior');

gulp.task('default', function(){
    gulp.src('entry.js')
        .pipe(melchior())
        .pipe(gulp.dest('modified-files'));
});
