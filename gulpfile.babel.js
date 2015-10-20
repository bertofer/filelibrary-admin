let gulp = require('gulp')

let browserify = require('browserify')
let source = require('vinyl-source-stream')
let connect = require('gulp-connect')
let concat = require('gulp-concat')
let clean = require('gulp-clean')
let sass = require('gulp-sass')
let nodeDebug = require('gulp-node-debug')
let nodemon = require('gulp-nodemon')
let env = require('gulp-env')
let ngConstant = require('gulp-ng-constant')

gulp.task('connectreload', () => {
  connect.reload()
})

// Tasks related to the front end.

gulp.task('clean', () => {
  gulp.src('./client/dist')
    .pipe(clean({
      force: true
    }))
})

gulp.task('scripts', () => {
  return browserify({ entries: ['client/index.js'], debug: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./client/dist'))
})

gulp.task('connect', () => {
  connect.server({
    root: 'client',
    livereload: true,
    port: 8002
  })
})

gulp.task('sass', () => {
  gulp.src('./client/styles/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./client/dist'))
})

gulp.task('watch', () => {
  gulp.watch(['./client/*.html'], ['connectreload'])
  gulp.watch(['./client/**/*.js'], ['scripts', 'connectreload', 'ng-dev'])
  gulp.watch('./client/styles/*.scss', ['sass', 'connectreload'])
})

// Backend tasks

gulp.task('set-env', () => {
  env({
    vars: {
      DEBUG: '*'
    }
  })
})

gulp.task('nodemon', function () {
  nodemon({
    script: 'server/index.js',
    ext: 'js',
    execMap: {
      js: 'node --harmony'
    },
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('debugger', () => {
  gulp.src(['server/index.js'])
  .pipe(nodeDebug({
    nodejs: ['--harmony', '--debug-brk'],
    webPort: 8001
  }))
})

// Constants for the frontEnd
gulp.task('ng-dev', () => {
  let devConstants = {
    SERVER_URL: 'http://localhost:8080/'
  }
  return ngConstant({
    name: 'filelibrary.constants',
    constants: devConstants,
    stream: true,
    wram: 'amd'
  })
  .pipe(gulp.dest('./client/dist'))
})

gulp.task('ng-prod', () => undefined)

gulp.task('client', ['clean', 'scripts', 'sass', 'ng-dev'])
gulp.task('clientdebug', ['client', 'connect', 'watch'])
gulp.task('serverdebug', ['debugger'])
gulp.task('debug', ['set-env', 'serverdebug', 'clientdebug'])
gulp.task('develop', ['clientdebug', 'set-env', 'nodemon'])
