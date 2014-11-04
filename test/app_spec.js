"use strict";
var assert  = require("yeoman-generator").assert;
var expect  = require("chai").expect;
var file    = require("yeoman-generator").file;
var helpers = require("yeoman-generator").test;
var path    = require("path");
var shell   = require("execSync");
var _       = require("lodash");

describe("node:app", function () {
	var MANIFEST = "package.json";

	function configureGit (name, email) {
		// Configure the project with Git.
		shell.run("git init --quiet");
		shell.run("git config --local user.name '" + name + "'");
		shell.run("git config --local user.email " + email);
	}

	describe("using default prompts", function () {
		before(function (done) {
			var tmp = path.join(__dirname, "tmp");

			helpers.run(path.join(__dirname, "..", "generators", "app"))
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

			var dependencies = [ "lodash", "q" ];

			var devDependencies = [
				"gulp", "gulp-jscs", "gulp-jshint", "gulp-lab",
				"jshint-stylish", "lab"
			];

			var manifest;

			assert.file(MANIFEST);
			manifest = file.readJSON(MANIFEST);

			_.each(defaults, function (value, name) {
				expect(manifest[name], name).to.equal(value);
			});
			expect(manifest.scripts.test, "test").to.equal("gulp");
			expect(manifest.scripts.coverage, "coverage").to.equal(
				"gulp coverage && xdg-open coverage.html || open coverage.html"
			);

			_.each(dependencies, function (name) {
				expect(manifest.dependencies, name).to.have.property(name);
			});

			_.each(devDependencies, function (name) {
				expect(manifest.devDependencies, name).to.have.property(name);
			});

			done();
		});

		it("creates a 'lib' directory", function (done) {
			assert.file("lib/");
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
			var tmp = path.join(__dirname, "tmp");

			helpers.run(path.join(__dirname, "..", "generators", "app"))
			.inDir(tmp)
			.withPrompt(prompts)
			.once("ready", configureGit.bind(null, "Foo", "foo@example.com"))
			.once("end", function () {
				manifest = file.readJSON(MANIFEST);
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
