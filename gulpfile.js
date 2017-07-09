'use strict';
var gulp    =   require('gulp'),
    concat  =   require('gulp-concat'),
    uglify  =   require('gulp-uglify'),
    pump    =   require('pump'),
    minCss  =   require('gulp-clean-css');

var sourceSet = {
    'thirdParty': {
        'js': ['node_modules/d3/build/d3.js'],
        'css': []
    },
    'app': {
        'js': 'src/js/*.js',
        'css': 'src/css/*.css',
        'html': 'src/html/*.html',
        'data': 'src/data/*.*'
    }
};

var buildSet = {
    'dir': 'dist',
    'names': {
        'js': 'stock-chart-demo.min.js',
        'css': 'stock-chart-demo.min.css'
    }
};

gulp.task('copy-js', function(callback) {
    pump(
        [
            gulp.src(sourceSet['thirdParty']['js'].concat(sourceSet['app']['js'])),
            concat(buildSet['names']['js']),
            uglify(),
            gulp.dest(buildSet['dir'])
        ],
        callback
    );
});

gulp.task('copy-css',  function(callback) {
    pump(
        [
            gulp.src(sourceSet['thirdParty']['css'].concat(sourceSet['app']['css'])),
            concat(buildSet['names']['css']),
            minCss(),
            gulp.dest(buildSet['dir'])
        ],
        callback
    );
});

gulp.task('copy-html', function(callback) {
   pump(
       [
           gulp.src(sourceSet['app']['html']),
           gulp.dest(buildSet['dir'])
       ],
       callback
   );
});

gulp.task('copy-csv', function(callback) {
    pump(
        [
            gulp.src(sourceSet['app']['data']),
            gulp.dest(buildSet['dir'])
        ],
        callback
    );
});

gulp.task('default', ['copy-html', 'copy-css', 'copy-js', 'copy-csv']);
gulp.task('build', ['default']);