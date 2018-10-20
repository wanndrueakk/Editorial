"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var svgmin = require('gulp-svgmin');
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
    autoprefixer({browsers: [
      "last 2 versions"
    ]}),
    mqpacker({
      sort: true
    })
  ]))
    .pipe(gulp.dest("source/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("clean", function() {
  return del("build");
});


gulp.task('script', function() {
  return gulp.src('source/js/**.js')
    .pipe(concat('style.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename('style.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/images/**",
    "source/js/**",
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("images", function() {
  return gulp.src("source/images")
    .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
    .pipe(gulp.dest("build/images"));
});

gulp.task('svgmin', function () {
  return gulp.src("build/images/**/*..svg")
    .pipe(svgmin(function getOptions (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
    .pipe(svgstore())
    .pipe(gulp.dest("build/images"));
});

gulp.task("html:copy", function() {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

gulp.task("serve", ['copy','style','script','images', 'svgmin'], function() {
  server.init({
    server: "source",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html:update"]);
  gulp.watch("source/js/*.js", ["style"]);
});


gulp.task("build", function(fn) {
  run("clean", "copy", "style", "script", "images", "svgmin", fn);
});
