"use strict";
var FS   = require("fs");
var Path = require("path");

var root      = Path.join(__dirname, "..", "..");
var templates = Path.join(root, "generators", "app", "templates");

function copy (from, to) {
	return FS.createReadStream(from).pipe(FS.createWriteStream(to));
}

// Ensure that local config matches the templates for scafolding.
copy(Path.join(templates, "editorconfig"), Path.join(root, ".editorconfig"));
copy(Path.join(templates, "jshint_source.json"), Path.join(root, ".jshintrc"));
copy(Path.join(templates, "jshint_test.json"), Path.join(root, "test", ".jshintrc"));
copy(Path.join(templates, "jscs.json"), Path.join(root, ".jscsrc"));

copy(Path.join(templates, "gulpfile.js"), Path.join(root, "gulpfile.js"))
.on("finish", function () {
	// Patch gulpfile for yeoman directory structure.
	var filePath = Path.join(root, "gulpfile.js");
	var gulpfile = FS.readFileSync(filePath, { encoding : "utf8" });
	gulpfile = gulpfile.replace("\"lib\"", "\"generators\"");
	FS.writeFileSync(filePath, gulpfile);
});
