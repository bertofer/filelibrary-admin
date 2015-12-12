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
let url = require('url')
let path = require('path')

// Tasks related to the front end.

gulp.task('clean', () => {
  gulp.src('./client/dist/*')
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

gulp.task('sass', () => {
  gulp.src('./client/styles/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./client/dist'))
})

// Backend tasks
// Local vars for developing
var localDev = {
    DEBUG: '*',
    SERVER_ADDRESS : 'localhost',
    APP_PORT : 8000,
    TEMP_DIR: path.join(__dirname, 'tempFiles'),
    FINAL_DIR: path.join(__dirname, 'finalFiles'),
    AUTHOR: 'Test Author',
    WEBSEED_ADDRESS: 'localhost',
    WEBSEED_PORT: 8001,
    TRACKER_ADDRESS: 'localhost',
    TRACKER_PORT: 8002,
    DB_PATH: 'mongodb://localhost/filelibrary'
}

gulp.task('dev-env', () => {
  env({
    vars: localDev
  })
})

gulp.task('nodemon', function () {
  nodemon({
    watch: ['server/', 'client/'],
    ignore: ['client/dist/'],
    ext: 'js html css',
    script: 'server/index.js',
    execMap: {
      js: 'node --harmony'
    },
    env: { 'NODE_ENV': 'development' }
  }).on('restart', ['client']);
})

gulp.task('debugger', () => {
  gulp.src(['server/index.js'])
  .pipe(nodeDebug({
    nodejs: ['--harmony', '--debug-brk'],
    webPort: 8080
  }))
})

// Constants for the frontEnd
gulp.task('ng-dev', () => {
  let devConstants = {
    SERVER_URL: url.format({
        protocol: 'http',
        hostname: localDev.SERVER_ADDRESS,
        port: localDev.APP_PORT,
        pathname: 'api/'
    })
  }
  return ngConstant({
    name: 'filelibrary.constants',
    constants: devConstants,
    stream: true,
    wram: 'amd'
  })
  .pipe(gulp.dest('./client/dist'))
})

gulp.task('ng-prod', () => {
    let prodConstants = {
        SERVER_URL: process.env.SERVER_URL
    }
    return ngConstant({
      name: 'filelibrary.constants',
      constants: devConstants,
      stream: true,
      wram: 'amd'
    })
    .pipe(gulp.dest('./client/dist'))
})

gulp.task('client', ['clean', 'scripts', 'sass', 'ng-dev'])
gulp.task('debug', ['client', 'dev-env', 'debugger'])
gulp.task('develop', ['client', 'dev-env', 'nodemon'])
gulp.task('prepare-client', ['client', 'ng-prod'])
