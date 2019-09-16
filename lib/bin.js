#!/usr/bin/env node

// Load library
const { run } = require("./index");

// Load yargs
const argv = require("yargs").argv;

// Validate args
if (argv.config) {
  // Pass to the library
  run(argv.config);
} else {
  console.log("--config path/to/config.json required");
}
