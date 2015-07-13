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
		this.fs.copy(this.templatePath("editorconfig"), this.destinationPath(".editorconfig"));
		this.fs.copy(this.templatePath("gulpfile.js"), this.destinationPath("gulpfile.js"));
		this.fs.copy(this.templatePath("jshint_source.json"), this.destinationPath(".jshintrc"));
		this.fs.copy(this.templatePath("jshint_test.json"), this.destinationPath("test/.jshintrc"));
		this.fs.copy(this.templatePath("jscs.json"), this.destinationPath(".jscsrc"));
		this.fs.copy(this.templatePath("gitignore"), this.destinationPath(".gitignore"));
	},

	writing : function () {
		this.template("package.json", "package.json", this.options);
	}
});
