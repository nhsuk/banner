const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();

// Compile SCSS
function compileCSS() {
  return gulp.src([
    'src/scss/banner.scss',
    'src/scss/nhsuk.scss',
  ])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/'));
}

// Transpile ES6
function webpackJS() {
  return gulp.src('src/js/index.js')
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'banner.js',
      },
      target: 'web',
      module: {
        rules: [
          {
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
    }))
    .pipe(gulp.dest('./dist'));
}

gulp.task('default', () => {
  // Compile CSS and JS
  webpackJS();
  compileCSS();

  // Start simple browsersync server
  browserSync.init({
    server: {
      baseDir: './app',
      routes: {
        '/dist': './dist',
        '/mocks': './mocks',
      },
    },
  });

  // Reload server on HTML changes
  gulp.watch('app/*.html').on('change', browserSync.reload);

  // Watch src CSS and JS and recompile dist
  gulp.watch('./src/js/*.js', gulp.series([webpackJS]));
  gulp.watch('./src/scss/*.scss', gulp.series([compileCSS]));

  // Subscribe server to CSS and JS updates
  gulp.watch('./dist/*').on('change', browserSync.reload);
});
