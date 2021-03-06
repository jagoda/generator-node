"use strict";
var Bluebird = require("bluebird");
var FS       = require("fs");
var Gulp     = require("gulp");
var Istanbul = require("gulp-istanbul");
var JSCS     = require("gulp-jscs");
var JSHint   = require("gulp-jshint");
var Mocha    = require("gulp-mocha");
var Path     = require("path");
var Stylish  = require("jshint-stylish");

var consume = require("stream-consume");
var _       = require("lodash");

var paths = {
	jscs : Path.join(__dirname, ".jscsrc"),

	jshint : {
		source : Path.join(__dirname, ".jshintrc"),
		test   : Path.join(__dirname, "test", ".jshintrc")
	},

	source : [
		Path.join(__dirname, "*.js"),
		Path.join(__dirname, "generators", "**", "*.js")
	],

	test : [
		Path.join(__dirname, "test", "**", "*_spec.js")
	]
};

var readFile = Bluebird.promisify(FS.readFile, FS);

function lint (options, files) {
	return Gulp.src(files)
	.pipe(new JSHint(options))
	.pipe(JSHint.reporter(Stylish))
	.pipe(JSHint.reporter("fail"));
}

function loadOptions (path) {
	return readFile(path, { encoding : "utf8" })
	.then(function (contents) {
		return JSON.parse(contents);
	});
}

function promisefy (stream) {
	var promise = new Bluebird(function (resolve, reject) {
		stream.once("finish", resolve);
		stream.once("error", reject);
	});

	consume(stream);
	return promise;
}

function style (options, files) {
	return Gulp.src(files).pipe(JSCS(options));
}

Gulp.task("default", [ "test" ]);

Gulp.task("lint", [ "lint-source", "lint-test" ]);

Gulp.task("lint-source", function () {
	return loadOptions(paths.jshint.source)
	.then(function (options) {
		return promisefy(lint(options, paths.source));
	});
});

Gulp.task("lint-test", function () {
	return Bluebird.join(
		loadOptions(paths.jshint.source),
		loadOptions(paths.jshint.test),
		function (source, test) {
			var options = _.merge(source, test);
			return promisefy(lint(options, paths.test));
		}
	);
});

Gulp.task("style", function () {
	return loadOptions(paths.jscs)
	.then(function (options) {
		return promisefy(style(options, paths.source.concat(paths.test)));
	});
});

Gulp.task("test", [ "lint", "style" ], function (done) {
	var thresholds = {
		global : {
			branches   : 100,
			functions  : 100,
			lines      : 100,
			statements : 100
		}
	};

	var stream = Gulp.src(paths.source)
	.pipe(new Istanbul())
	.pipe(Istanbul.hookRequire())
	.on("finish", function () {
		var stream = Gulp.src(paths.test)
		.pipe(new Mocha())
		.pipe(Istanbul.writeReports())
		.pipe(Istanbul.enforceThresholds({ thresholds : thresholds }))
		.on("end", done)
		.on("error", done);

		consume(stream);
	});

	consume(stream);
});
