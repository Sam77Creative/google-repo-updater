"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var app_1 = require("./app/app");
function run(configFile) {
    var config;
    try {
        config = JSON.parse(fs.readFileSync(configFile).toString());
    }
    catch (e) {
        console.log("Failed to load the config file");
        console.log(e);
        return;
    }
    var app = new app_1.App(config);
}
exports.run = run;
