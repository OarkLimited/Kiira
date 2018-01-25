/// <binding />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

/// <binding BeforeBuild='sass' ProjectOpened='sass:watch' />
//http://developer.telerik.com/featured/css-preprocessing-with-visual-studio/

/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    htmlmin = require('gulp-htmlmin');


var paths = {
    webroot: "./"
};

paths.vendors = paths.webroot + "vendors/";
paths.src = paths.webroot + "src/";
paths.dest = paths.webroot + "";


gulp.task('clean:node_modules', function (cb) {
    rimraf(paths.vendors, cb);
});

//https://eliot-jones.com/2015/6/visual-studio-2015-gulp
gulp.task('copy:node_modules', ['clean:node_modules'], function (cb) {
    var node_modules = {
        "include-media": ["./node_modules/include-media/dist/_include-media.scss"]
    };

    for (var destinationDir in node_modules) {
        gulp.src(node_modules[destinationDir])
            .pipe(gulp.dest(paths.vendors + destinationDir));
    }
});

gulp.task('build:app', function (cb) {

    let jsFilter = filter('**/*.js', { restore: true });
    let cssFilter = filter('**/*.css', { restore: true });
    let sassFilter = filter('**/*.scss', { restore: true });
    let htmlFilter = filter('**/*.html', { restore: true });

    gulp.src([paths.src + '**', '!./src/templates/**', '!./src/templates/'])

        //Compile SASS
        .pipe(sassFilter)
        .pipe(sass().on('error', sass.logError))
        .pipe(sassFilter.restore)
        
        //Minify Css
        .pipe(cssFilter)
        .pipe(cssmin())
        .pipe(cssFilter.restore)
        
        //Minify HTML
        .pipe(htmlFilter)
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
            ////https://stackoverflow.com/a/23695535
            //ignoreCustomComments: [
            //    /^!--.*?--/
            //],
            //removeComments: true
        }))
        .pipe(htmlFilter.restore)

        .pipe(gulp.dest(paths.dest));
});
