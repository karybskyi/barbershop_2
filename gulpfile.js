var gulp = require('gulp'); 
var less = require('gulp-less');
var plumber = require('gulp-plumber'); 
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer'); 
var server = require('browser-sync').create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var webp = import("gulp-webp");
var svgstore = require("gulp-svgstore");

gulp.task('style', function(){
  return gulp.src('source/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css'))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('source/css'))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationlevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return import("gulp-webp").then(function (gulpWebp) {
    return gulp.src("source/img/**/*{png,jpg}")
      .pipe(gulpWebp.default({quality: 90}))
      .pipe(gulp.dest("source/img"));
  });
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task('serve', gulp.series('style', function () {
  server.init({
    server: 'source/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  
  gulp.watch('source/less/**/*.less', gulp.series('style'));
  gulp.watch('source/**/*.html').on('change', server.reload);
}));

gulp.task('default', gulp.series('serve'));
