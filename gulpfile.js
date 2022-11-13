import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import sync from 'browser-sync';
import {deleteAsync} from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';
import htmlmin from 'gulp-htmlmin';
import jsmin from 'gulp-uglify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';


const sass = gulpSass(dartSass);
const server = sync.create();


gulp.task("clean", async function () {
  return await deleteAsync(["build"]);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp.src([
  "source/img/icon-*.svg",
  "source/img/logo-*.svg"
  ], {
    base: "source/img"
  })
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("jsmin", function () {
  return gulp.src("source/js/*.js")
    .pipe(jsmin())
    .pipe(rename(function(path) {
      path.extname = ".min.js";
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp.src([
    "source/img/**/*.{png,jpg}",
    "source/img/icon-*.svg",
    "source/img/logo-*.svg",
    "source/img/bg-*.svg"
  ], {
    base: "source/img"
  })
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("optiimg", gulp.series("images", "webp"));
gulp.task("build", gulp.series("clean","copy", "css", "sprite", "html", "jsmin", "optiimg"));
gulp.task("start", gulp.series("build", "server"));
