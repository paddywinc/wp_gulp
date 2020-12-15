'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require( 'browser-sync' ).create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.
const zip = require( 'gulp-zip' );
/**
 * Here we set a prefix for our compiled and stylesheet and scripts.
 * Note that this should be the same as the `$themeHandlePrefix` in `func-script.php` and `func-style.php`.
 */
const themePrefix = 'wincwp';

/**
 * Asset paths.
 */
const scssSrc = 'scss/**/*.scss';

const jsSrcDir = 'js';
const jsSrcFiles = [
    `${jsSrcDir}/scripts/*`,
];

const jsVendorSrcDir = 'js';
const jsVendorSrcFiles = [
    `${jsVendorSrcDir}/vendor/*`,
];

/**
 * Plumber Error Logging                  
 */
function scssError(e) {
  console.log(`❌ CSS Fail ❌\nError in file: ${e.relativePath} on Line: ${e.line} column: ${e.column} \n${e.formatted}`);
};

/**
 * Task for styles.
 *
 * Scss files are compiled and sent over to `assets/css/`.
 */
gulp.task('css', function () {
 return gulp.src(scssSrc)
  .pipe(sourcemaps.init())
  .pipe(plumber({ errorHandler: scssError })) // <---- this guy add it before the scss is being done
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(rename(`${themePrefix}.min.css`))
  .pipe(gulp.dest('./css/'));
});

/**
 * Task for scripts.
 *
 * Js files are uglified and sent over to `assets/js/scripts/`.
 */
gulp.task('js', function () {
    return gulp.src(jsSrcFiles)
        .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(concat(`${themePrefix}.min.js`))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));
});

/**
 * Task for Vendor scripts.
 *
 * Js Vendor files are uglified and sent over to `assets/js/scripts/`.
 */
gulp.task('vendorjs', function () {
    return gulp.src(jsVendorSrcFiles)
        .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(concat(`${themePrefix}-vendor.min.js`))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));
});


/**
 * Task for watching styles and scripts.
 */
gulp.task('watch', function () {
    gulp.watch(scssSrc, ['css']);
    gulp.watch(jsSrcFiles, ['js']);
});

///// Browser Sync /////
gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "wincwpmaster.local",
        notify: false
    });
    gulp.watch('./scss/**/*.scss', ['css']).on('change', browserSync.reload);
    gulp.watch('js/scripts/common.js', ['js']).on('change', browserSync.reload);
    gulp.watch('./php/*.php', ['php']).on('change', browserSync.reload);
});

/**
 *Zip Package.
 *
 * Packages all files to theme folder
 */
gulp.task('zip', function () {
  return gulp.src([
    './../**/*', 
    '!./../{node_modules,node_modules/**/*}', 
    '!./assets/{sass,sass/*}', 
    '!./gulpfile.js', 
    '!./package.json', 
    '!./package-lock.json'
  ])
    .pipe(zip('wincwp.zip'))
    .pipe(gulp.dest('./../../'));
});

/**
 * Default task
 */
gulp.task('default', ['css', 'js' , 'vendorjs' , 'watch' , 'browser-sync'] );

