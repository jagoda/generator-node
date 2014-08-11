"use strict";
var Q      = require("q");
var yeoman = require("yeoman-generator");

module.exports = yeoman.generators.Base.extend({

	dependencies : [ "lodash", "q" ],

	devDependencies : [
		"gulp", "gulp-jscs", "gulp-jshint", "gulp-lab", "jshint-stylish", "lab"
	],

	configure : function () {
		this.src.copy("gulpfile.js", "gulpfile.js");
		this.src.copy("jshint_source.json", ".jshintrc");
		this.src.copy("jshint_test.json", "test/.jshintrc");
		this.src.copy("jscs.json", ".jscsrc");
		this.src.copy("gitignore", ".gitignore");

		this.dest.write("package.json", JSON.stringify({}));
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
