/**
 * Created by nocoolyoyo on 2017/10/26.
 * gulp配置
 */

const gulp = require('gulp');

const sass = require('gulp-sass');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');

const entryPath = './src/assets/scss/';
const outputPath = './src/modules/custom/royal/';


//服务器
gulp.task('webserver', function() {
    connect.server({
        root: './src/',
        livereload: {
            port:8070
        },
        port: 8070,
        index: './src/pages/index.html'
    });
});
//文件监听
gulp.task('watch', function(){
    gulp.watch(`${entryPath}*.scss`, ['build', 'desktop']);
    gulp.watch(`${entryPath}components/*.scss`, ['build']);
    // Other watchers
});

//输出最终编译版本stylesheet文件
gulp.task('build', function(){
    return gulp.src(`${entryPath}style.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(sass()) // Using gulp-sass
        .pipe(plumber.stop())
        .pipe(gulp.dest(outputPath))
        .pipe(connect.reload());
});
//输出最终编译版本stylesheet文件
gulp.task('desktop', function(){
    return gulp.src(`${entryPath}desktop.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(sass()) // Using gulp-sass
        .pipe(plumber.stop())
        .pipe(gulp.dest(outputPath))
        .pipe(connect.reload());
});

// // 输出全部文章文件
gulp.task('sass', ['build', 'desktop', 'watch', 'webserver']);