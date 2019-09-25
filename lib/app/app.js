"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var uuid = require("uuid/v4");
var pubSub_service_1 = require("./services/pubSub.service");
var App = (function () {
    function App(config) {
        this.config = config;
        this.init();
        this.startApp();
    }
    App.prototype.startApp = function () {
        var _this = this;
        this.subscribeToPubSub();
        process.on("SIGINT", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Shutting down...");
                process.exit();
                return [2];
            });
        }); });
    };
    App.prototype.subscribeToPubSub = function () {
        var _this = this;
        var sessionId = this.createSessionID();
        console.log("Starting subscription...");
        this.pubSub.subscribe(this.config.topic, sessionId, function (data) {
            console.log("GOT DATA");
            for (var _i = 0, _a = _this.config.configs; _i < _a.length; _i++) {
                var config = _a[_i];
                if (!_this.isCorrectRepository(data, config)) {
                    return;
                }
                if (!_this.isCorrectBranch(data, config)) {
                    return;
                }
                console.log("Executing script for config");
                console.log(config);
                _this.executeScript(config);
            }
        });
    };
    App.prototype.isCorrectRepository = function (data, config) {
        console.log(data.name + " vs. " + config.repository);
        return data.name === config.repository;
    };
    App.prototype.isCorrectBranch = function (data, config) {
        var refs = Object.keys(data.refUpdateEvent.refUpdates);
        return refs.find(function (r) { return r === config.branch; }) ? true : false;
    };
    App.prototype.executeScript = function (config) {
        child_process.exec("sh " + config.shellScript, function (error, stdout, stderr) {
            if (error) {
                console.log("Eror running shell script");
                console.log(error);
                return;
            }
            console.log(stdout);
            console.log(stderr);
        });
    };
    App.prototype.createSessionID = function () {
        return uuid();
    };
    App.prototype.init = function () {
        this.pubSub = new pubSub_service_1.PubSubService(this.config.keyFile, this.config.projectId);
    };
    return App;
}());
exports.App = App;
