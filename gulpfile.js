import gulp from 'gulp'; 
import plumber from 'gulp-plumber';
import createServer from 'browser-sync';
import less from 'gulp-less';
import posthtml from 'gulp-posthtml';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import include from 'posthtml-include';
import minify from "gulp-csso";
import rename from "gulp-rename";
import webp from 'gulp-webp';
import svgstore from "gulp-svgstore";
import del from 'del';

gulp.task('style', function () {
  return gulp.src('source/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css'))
});

gulp.task('watch', function () {
  gulp.watch('source/less/**/*.less', gulp.series('style', server.reload));
  gulp.watch('source/**/*.html').on('change', server.reload);
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationlevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task('serve', function () {
  console.log('Starting serve task');
  const server = createServer({
    server: 'build/',
  });
  
  gulp.watch('source/less/**/*.less', gulp.series('style', function () {
    server.reload();
}));
  gulp.watch('source/**/*.html', gulp.series('html'));
});

gulp.task("copy", function (done) {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "style", 
  "sprite", 
  "html"
));