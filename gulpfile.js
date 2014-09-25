var gulp = require('gulp'),
    melchior = require('./gulp-melchior');

gulp.task('default', function(){
    gulp.src('folder/entry.js')
        .pipe(melchior({
            path: 'folder/'
        }))
        .pipe(gulp.dest('modified-files'));
});
