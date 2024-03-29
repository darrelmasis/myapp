import {parallel, series, watch} from 'gulp'
import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import darthSass from 'sass'
import babelify from 'babelify'
import minify from 'gulp-minify'
import rename from 'gulp-rename'
import notify from 'gulp-notify'
import buffer from 'vinyl-buffer'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import browserify from 'browserify'
import browserSync from 'browser-sync'
import autoprefixer from 'autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import source from 'vinyl-source-stream'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
const server = browserSync.create()
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

  views: {
    src: "./src/public/dev/js/router.js",
    dest: "./src/public/dist/js"
  }
}

// Compila Sass para desarrollo
const stylesDev = () => {
  return gulp.src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass({
      sourceComments: true,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(server.stream({ match: '**/*.css' }))
    .pipe(notify({
      title: 'Modo de desasrrollo',
      message: 'Estilos SCSS compilados con éxito',
      wait: true
    }))
}

// Compila Sass para producción
const stylesBuild = () => {
  return gulp.src(path.styles.src)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(server.stream({ match: '**/*.css' }))
}

// Compila JavaScript sin minficar
const scriptsDev = () => {
  return browserify(path.scripts.src)
    .transform(babelify, {
      global: true
    })
    .bundle()
    .on('error', err => {
      console.log(err)
      this.end()
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.scripts.dest))
}

// Compila JavaScript minificado
const scriptsBuild = () => {
  return browserify(path.scripts.src)
    .transform(babelify, {
      global: true
    })
    .bundle()
    .on('error', err => {
      console.log(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({dirname: '/', basename: 'scripts', prefix: '', suffix: '', extname: '.min.js'}))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.scripts.dest))
}

const viewsBuild = () => {
  return browserify(path.views.src)
    .transform(babelify, {
      global: true
    })
    .bundle()
    .on('error', err => {
      console.log(err)
      this.emit('end')
    })
    .pipe(source('router.js'))
    .pipe(buffer())
    .pipe(minify({ ext: { src: '.js', min: '.min.js' } }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.views.dest))
}

const browserSyncServe = done => {
  server.init({
    proxy: 'localhost:3000'
  })
  done()
}

const reload = done => {
  server.reload()
  done()
}

const watchFiles = done => {
  watch('./src/public/dev/scss/**/*.scss', stylesDev)
  watch('./src/public/dev/js/**/*.js', series(scriptsDev, reload))
  done()
}


exports.dev = parallel(browserSyncServe, watchFiles)
exports.build = series(stylesBuild, scriptsBuild)
exports.styles = parallel(stylesDev, watchFiles)
exports.scripts = scriptsDev
exports.build_styles = stylesBuild
exports.build_scripts = scriptsBuild
exports.build_views = viewsBuild