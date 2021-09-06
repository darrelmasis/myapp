import gulp from 'gulp'
import minify from 'gulp-minify'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import gulpSass from 'gulp-sass'
import darthSass from 'sass'
import sourcemaps from 'gulp-sourcemaps'
import babelify from 'babelify'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import autoprefixer from 'autoprefixer'
import rename from 'gulp-rename'
import pug from "gulp-pug";
import GulpPostCss from 'gulp-postcss'
import beautify from 'gulp-beautify'

const sass = gulpSass(darthSass)

const path = {
  styles: {
      src: "./src/public/dev/scss/styles.scss",
      dest: "./src/public/dist/css"
  },

  scripts: {
      src: "./src/public/dev/js/scripts.js",
      dest: "./src/public/dist/js"
  },
  pug: {
      src: './src/views/pages/*.pug',
      dest: './src/public/pages/'
  }
}

/**
 * Compila SASS para producción
 */

 const styles = done => {
  gulp.src(path.styles.src)
      .pipe(sourcemaps.init())
      // .pipe(plumber())
      .pipe(sass({outputStyle: 'compressed', sourceComments: true}))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(path.styles.dest))
  done()
}

const views = done => {
  gulp.src(path.pug.src)
    .pipe(pug())
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest(path.pug.dest))
  done()
}
/**
 * Compila JavaScript para producción
 */
 const scripts = done => {
  browserify(path.scripts.src)
      .transform(babelify, {
          global: true
      })
      .bundle()
      .on('error', function (err) {
          console.log(err)
          this.emit('end')
      })
      .pipe(source('scripts.js'))
      .pipe(buffer())
      .pipe(minify({
          ext: {
              min: '.min.js'
          }
      }))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.scripts.dest))
  done()
}


/**
 * Gulp tasks
 */
gulp.task('styles', styles)

gulp.task('views', views)
gulp.task('scripts', scripts)


gulp.watch(path.styles.src, styles)
// gulp.watch(path.pug.src, views)
gulp.watch(path.scripts.src, scripts)
