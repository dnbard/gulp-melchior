Gulp Melchior
=============

Optimize (concatenate) [melchior.js](https://github.com/voronianski/melchior.js) projects using Gulp plugin.

Getting Started
---------------

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started) guide, as it explains how to create a `Gulpfile` as well as install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gulp-melchior --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gulpfile with this line of JavaScript:

```js
var melchior = require('gulp-melchior');
```

Melchior task
-------------

This is basic task to concatenate all files in Melchior project

```js
gulp.task('melchior', function(){
  gulp.src('config.js')
    .pipe(melchior())
    .pipe(gulp.dest('build'));
});
```

Options
-------

`melchior` plugin can be initialized with options object. In example:

```js
.pipe(melchior({
  path: 'folder/'
}));
```

path: String
____________

This option is used when file with Melchior config isn't in the same folder as Gulp(this is normal).

Folder structure:
```
├──gulpfile.js
└──app
   ├──js
   │  ├──config.js
   │  ├──app.js
   │  └──module.js
   ├──html
   └──css
```

MelchiorJS config:
```js
melchiorjs.config({
  paths: {
    'module': 'js/module.js'
  }
});
```

Gulp Task example:
```js
gulp.task('melchior', function(){
  gulp.src('app/js/config.js')
    .pipe(melchior({
      path: 'app/'
    }))
    .pipe(gulp.dest('build'));
});
```

*Please end `path` with correct path delimeter character.*

Concatenation of non-local files
--------------------------------

Right now non-local files don't concatenated in result file.