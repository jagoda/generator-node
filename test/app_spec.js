"use strict";
var assert  = require("yeoman-generator").assert;
var expect  = require("chai").expect;
var FS      = require("fs");
var helpers = require("yeoman-generator").test;
var Path    = require("path");
var shell   = require("child_process").execSync;
var _       = require("lodash");

describe("node:app", function () {
	var MANIFEST = "package.json";

	function configureGit (name, email) {
		// Configure the project with Git.
		shell("git init --quiet");
		shell("git config --local user.name '" + name + "'");
		shell("git config --local user.email " + email);
	}

	describe("using default prompts", function () {
		before(function (done) {
			var tmp = Path.join(__dirname, "tmp");

			helpers.run(Path.join(__dirname, "..", "generators", "app"))
			.inDir(tmp)
			.once("ready", configureGit.bind(null, "Testy Tester", "testy@testers.com"))
			.once("end", done);
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
			var defaults = {
				author      : "Testy Tester <testy@testers.com>",
				description : "",
				license     : "MIT",
				name        : "tmp",
				version     : "0.0.0"
			};

			var dependencies = [ "bluebird", "lodash" ];

			var devDependencies = [
				"gulp", "gulp-jscs", "gulp-jshint", "gulp-istanbul",
				"gulp-mocha", "jshint-stylish", "mocha", "stream-consume"
			];

			var manifest;

			assert.file(MANIFEST);
			manifest = JSON.parse(FS.readFileSync(MANIFEST));

			_.each(defaults, function (value, name) {
				expect(manifest[name], name).to.equal(value);
			});
			expect(manifest.scripts.test, "test").to.equal("gulp");
			expect(manifest.scripts.coverage, "coverage").to.equal(
				"gulp && xdg-open coverage/lcov-report/index.html || " +
				"open coverage/lcov-report/index.html"
			);

			_.each(dependencies, function (name) {
				expect(manifest.dependencies, name).to.have.property(name);
			});

			_.each(devDependencies, function (name) {
				expect(manifest.devDependencies, name).to.have.property(name);
			});

			done();
		});

		it("creates a .editorconfig file", function (done) {
			assert.file(".editorconfig");
			done();
		});

		it("creates a 'test' directory", function (done) {
			assert.file("test/");
			done();
		});
	});

	describe("with custom NPM attributes", function () {
		var prompts = {
			author      : "Octocat <octocat@github.com>",
			description : "The coolest project ever.",
			license     : "Apache 2.0",
			name        : "project-awesome",
			version     : "42.0.0"
		};
		var manifest;

		before(function (done) {
			helpers.run(Path.join(__dirname, "..", "generators", "app"))
			.inTmpDir()
			.withPrompts(prompts)
			.once("ready", configureGit.bind(null, "Foo", "foo@example.com"))
			.once("end", function () {
				manifest = JSON.parse(FS.readFileSync(MANIFEST));
				done();
			});
		});

		it("uses prompt answers in the manifest", function (done) {
			_.each(prompts, function (value, name) {
				expect(manifest[name], name).to.equal(value);
			});
			done();
		});
	});
});
