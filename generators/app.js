"use strict";
var Q      = require("q");
var util   = require("util");
var yeoman = require("yeoman-generator");
var _      = require("lodash");

module.exports = yeoman.generators.Base.extend({

	dependencies : [ "lodash", "q" ],

	devDependencies : [
		"gulp", "gulp-jscs", "gulp-jshint", "gulp-lab", "jshint-stylish", "lab"
	],

	manifest : {
		scripts : {
			coverage : "gulp coverage",
			test     : "gulp"
		}
	},

	prompting : function () {
		var done = this.async();

		this.prompt(
			[
				{
					type    : "input",
					name    : "name",
					message : "name",
					default : this.appname
				},
				{
					type    : "input",
					name    : "version",
					message : "version",
					default : "0.0.0"
				},
				{
					type    : "input",
					name    : "description",
					message : "description"
				},
				{
					type    : "input",
					name    : "author",
					message : "author",
					default : util.format("%s <%s>", this.user.git.name(), this.user.git.email())
				},
				{
					type    : "input",
					name    : "license",
					message : "license",
					default : "MIT"
				}
			],
			function (answers) {
				_.merge(this.manifest, answers);
				done();
			}.bind(this)
		);
	},

	configuring : function () {
		this.src.copy("gulpfile.js", "gulpfile.js");
		this.src.copy("jshint_source.json", ".jshintrc");
		this.src.copy("jshint_test.json", "test/.jshintrc");
		this.src.copy("jscs.json", ".jscsrc");
		this.src.copy("gitignore", ".gitignore");

		this.dest.write("package.json", JSON.stringify(this.manifest));
	},

	install : function () {
		var done = this.async();

		Q.all([
			Q.ninvoke(this, "npmInstall", this.dependencies, { "--save" : true }),
			Q.ninvoke(this, "npmInstall", this.devDependencies, { "--save-dev" : true })
		])
		.nodeify(done);
	}

});
