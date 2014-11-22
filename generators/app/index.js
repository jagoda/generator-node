"use strict";
var util   = require("util");
var yeoman = require("yeoman-generator");

module.exports = yeoman.generators.Base.extend({
	options : {},

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
				this.options = answers;
				done();
			}.bind(this)
		);
	},

	configuring : function () {
		this.src.copy("editorconfig", ".editorconfig");
		this.src.copy("gulpfile.js", "gulpfile.js");
		this.src.copy("jshint_source.json", ".jshintrc");
		this.src.copy("jshint_test.json", "test/.jshintrc");
		this.src.copy("jscs.json", ".jscsrc");
		this.src.copy("gitignore", ".gitignore");
	},

	writing : function () {
		this.template("package.json", "package.json", this.options);
		this.dest.mkdir("lib");
	}
});
