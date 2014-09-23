var gulp = require('gulp'),
    melchior = require('./gulp-melchior');

gulp.task('default', function(){
    console.log('I\'m alive!');
    gulp.src('entry.js')
        .pipe(melchior())
        .pipe(gulp.dest('modified-files'));
});
