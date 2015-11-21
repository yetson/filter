var fs = require("fs");
var gulp = require("gulp");
var browserSync =require('browser-sync').create();
var babel = require("gulp-babel");
var browserify = require("browserify");
var babelify = require("babelify");

gulp.task('default', ['bundle'], function(){
    gulp.watch(["./public/js/src/*.js"], bundle);

    browserSync.init({
        server: {
          baseDir: './public'
        },
        files: './public/',
        browser: 'google chrome',
        reloadDelay: 1000
    });
});

gulp.task('bundle', bundle);

function bundle(){
  if(!fs.existsSync('./public/js/dist/')){
    console.log("creating dir...");
    fs.mkdirSync('./public/js/dist/');
  }
  browserify({ debug: true })
    .transform(babelify)
    .require("./public/js/src/main.js", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(fs.createWriteStream("./public/js/dist/bundle.js"));
}