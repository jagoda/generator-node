"use strict";
var assert  = require("yeoman-generator").assert;
var file    = require("yeoman-generator").file;
var helpers = require("yeoman-generator").test;
var Lab     = require("lab");
var path    = require("path");
var script  = exports.lab = Lab.script();
var _       = require("lodash");

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("node:app", function () {
	function checkDependencies (dependencies, loaded) {
		_.each(dependencies, function (dependency) {
			assert.file("node_modules/" + dependency);
			expect(loaded).to.include(dependency);
		});
	}

	function packageDependencies (dev) {
		var manifest = file.readJSON("package.json");
		return _.keys(manifest[ dev ? "devDependencies" : "dependencies" ]);
	}

	before(function (done) {
		helpers.run(path.join(__dirname, "..", "generators", "app"))
		.inDir(path.join(__dirname, "tmp"))
		.on("end", done);
	});

	it("creates a gulpfile", function (done) {
		assert.file("gulpfile.js");
		done();
	});

	it("configures JSHint", function (done) {
		assert.file([ ".jshintrc", "test/.jshintrc" ]);
		done();
	});

	it("configures JSCS", function (done) {
		assert.file(".jscsrc");
		done();
	});

	it("creates a .gitignore file", function (done) {
		assert.file(".gitignore");
		done();
	});

	it("creates a project manifest", function (done) {
		assert.file("package.json");
		done();
	});

	it("installs project dependencies", function (done) {
		var dependencies = [ "lodash", "q" ];
		var loaded       = packageDependencies();

		checkDependencies(dependencies, loaded);
		done();
	});

	it("installs development dependencies", function (done) {
		var dependencies = [
			"gulp", "gulp-jscs", "gulp-jshint", "gulp-lab", "jshint-stylish", "lab"
		];
		var loaded = packageDependencies(true);

		checkDependencies(dependencies, loaded);
		done();
	});
});
