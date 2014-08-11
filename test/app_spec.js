"use strict";
var assert  = require("yeoman-generator").assert;
var helpers = require("yeoman-generator").test;
var Lab     = require("lab");
var lab     = exports.lab = Lab.script();
var path    = require("path");

var before   = lab.before;
var describe = lab.describe;
var it       = lab.it;

describe("node:app", function () {
	before(function (done) {
		helpers.run(path.join(__dirname, "../generators/app"))
		.inDir(path.join(__dirname, "tmp"))
		.on("end", done);
	});

	it("creates a gulpfile", function (done) {
		assert.file([ "gulpfile.js" ]);
		done();
	});

	it("configures JSHint", function (done) {
		assert.file([ ".jshintrc", "test/.jshintrc" ]);
		done();
	});

	it("configures JSCS", function (done) {
		assert.file([ ".jscsrc" ]);
		done();
	});

	it("creates a .gitignore file", function (done) {
		assert.file([ ".gitignore" ]);
		done();
	});
});
