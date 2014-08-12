"use strict";
var assert  = require("yeoman-generator").assert;
var file    = require("yeoman-generator").file;
var helpers = require("yeoman-generator").test;
var Lab     = require("lab");
var path    = require("path");
var script  = exports.lab = Lab.script();
var shell   = require("shelljs");
var _       = require("lodash");

var before   = script.before;
var describe = script.describe;
var expect   = Lab.expect;
var it       = script.it;

describe("node:app", function () {
	var MANIFEST = "package.json";

	function configureGit (name, email) {
		// Configure the project with Git.
		shell.exec("git init --quiet");
		shell.exec("git config --local user.name '" + name + "'");
		shell.exec("git config --local user.email " + email);
	}

	describe("using default prompts", function () {
		function checkDependencies (dependencies, loaded) {
			_.each(dependencies, function (dependency) {
				assert.file("node_modules/" + dependency);
				expect(loaded).to.include(dependency);
			});
		}

		function packageDependencies (dev) {
			var manifest = file.readJSON(MANIFEST);
			return _.keys(manifest[ dev ? "devDependencies" : "dependencies" ]);
		}

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
				description : undefined,
				license     : "MIT",
				name        : "tmp",
				version     : "0.0.0"
			};

			var manifest;

			assert.file(MANIFEST);
			manifest = file.readJSON(MANIFEST);

			_.each(defaults, function (value, name) {
				expect(manifest[name], name).to.equal(value);
			});
			expect(manifest.scripts.test, "test").to.equal("gulp");
			expect(manifest.scripts.coverage, "coverage").to.equal("gulp coverage");

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
