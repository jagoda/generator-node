"use strict";
var file      = require("yeoman-generator").file;
var path      = require("path");
var root      = path.join(__dirname, "..", "..");
var templates = path.join(root, "generators", "app", "templates");

// Ensure that local config matches the templates for scafolding.
file.copy(path.join(templates, "editorconfig"), path.join(root, ".editorconfig"));
file.copy(path.join(templates, "gulpfile.js"), path.join(root, "gulpfile.js"));
file.copy(path.join(templates, "jshint_source.json"), path.join(root, ".jshintrc"));
file.copy(path.join(templates, "jshint_test.json"), path.join(root, "test", ".jshintrc"));
file.copy(path.join(templates, "jscs.json"), path.join(root, ".jscsrc"));
