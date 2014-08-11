"use strict";
var yeoman = require("yeoman-generator");

module.exports = yeoman.generators.Base.extend({

	configure : function () {
		this.src.copy("gulpfile.js", "gulpfile.js");
		this.src.copy("jshint_source.json", ".jshintrc");
		this.src.copy("jshint_test.json", "test/.jshintrc");
		this.src.copy("jscs.json", ".jscsrc");
		this.src.copy("gitignore", ".gitignore");
	}

});
