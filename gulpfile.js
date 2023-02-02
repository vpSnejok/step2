import gulp from "gulp";

const {src, dest, watch, series, parallel} = gulp;
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";

import browserSync from "browser-sync";

const bsServer = browserSync.create();

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import clean from 'gulp-clean';
import gulpUglify from 'gulp-uglify';
import gulpConcat from 'gulp-concat';
import gulpRename from "gulp-rename";
import imagemin from 'gulp-imagemin';
import gulpHtml from 'gulp-html-partial';
const sass = gulpSass(dartSass);

function serve() {
    bsServer.init({
        server: {
            baseDir: "./",
            browser: "chrome",
        },
    });
}

function styles() {
    return src("./src/scss/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
                cascade: true,
            })
        )
        .pipe(cleanCSS({compatibility: "ie8"}))
        .pipe(gulpRename("styles.min.css"))
        .pipe(dest("./dist/css/"))
        .pipe(bsServer.reload({stream: true}));
}

function scripts() {
    return src("./src/js/**/*.js")
        .pipe(gulpConcat('scripts.min.js'))
        .pipe(gulpUglify())
        .pipe(dest("./dist/js/")).pipe(bsServer.reload({stream: true}))

}

function images() {
    return src("./src/img/**/*.{jpg,jpeg,png,svg,webp}")
        .pipe(imagemin())
        .pipe(dest("./dist/img")).pipe(bsServer.reload({stream: true}))
}
function html(){
    return src("./src/index.html")
        .pipe(gulpHtml({
            basePath: 'src/html/'
        }))
        .pipe(dest("./")).pipe(bsServer.reload({stream: true}))
}
function watcher() {
    watch('./src/scss/**/*.scss', styles);
    watch("./src/**/*.html").on("change", html);
    watch("./src/js/*.js").on("change", series(scripts, bsServer.reload));
    watch("./src/img/**/*.{jpg,jpeg,png,svg,webp}").on("change", images)
}
 function clear(){
     return src('./dist/',{"allowEmpty": true})
         .pipe(clean({force: true}))
         .pipe(dest('dist'));
 }
export const dev = series(html, styles, scripts, images, parallel(serve, watcher));
export const build = series(clear, html, styles, scripts, images)