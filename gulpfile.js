"use strict";
var gulp = require("gulp");
var typescript = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var minifier = require("gulp-minifier");
var mocha = require("gulp-mocha");
var runSequence = require("run-sequence");
var browserify = require("browserify");
var browserifyshim = require("browserify-shim");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");

var typescriptProject = typescript.createProject('tsconfig.json');

gulp.task("browserify", function() {

    return browserify({

            entries: "./src/index.js",
            debug: true

        }).transform(browserifyshim)
        .bundle()
        .pipe(source("out.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on("error", gutil.log)
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./mini"));
});

/** Watches all TS files in project directory and rebuilds on any change. */
gulp.task("watch", ["start"], function() {
    gulp.watch(["src/*.t*", "src/components/*.t*", "src/api/*.t*"], "build");
    gulp.watch(["src/styles/**/*", "!src/styles/external/bootstrap"], "sass-and-mini");
});

gulp.task("build", function(callback) {

    runSequence("compile-typescript", "browserify");
});

gulp.task("sass-and-mini", function(callback) {

    runSequence("compile-sass", "minify", callback);
});

/** Compiles SASS files to CSS */
gulp.task("compile-sass", function() {

    return gulp.src("./src/styles/*.scss")
        .pipe(sass({
            includePaths: ["./src/styles/external"]
        }))
        .pipe(gulp.dest("./dist/styles/"));
});

/** Compiles backend, API-related TypeScript to JavaScript */
gulp.task('compile-typescript', function() {

    var tsResult = typescriptProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescriptProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

/** Minifies CSS and JS in dist */
gulp.task("minify", function() {

    return gulp.src("./dist/**/*").pipe(minifier({

        minify: true,
        collapseWhiteSpace: true,
        conservativeCollapse: true,
        minifyJS: true,
        minifyCSS: true,
        getKeptComment: function(content, filePath) {

            var match = content.match(/\/\*![\s\S]*?\*\//img);
            return match && match.join("\n") + "\n" || "";
        }
    })).pipe(gulp.dest("./mini/"));
});

/** Executes all unit tests */
gulp.task("run-unit-tests", ["compile-typescript"], function() {

    return gulp.src('tests/unit/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
});