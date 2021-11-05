"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importStar(require("path"));
const cerbos_1 = require("cerbos");
const child_process_1 = require("child_process");
const moduleRoot = (0, path_1.resolve)(__dirname, "../");
const dotCerbos = (0, path_1.resolve)(moduleRoot, ".cerbos");
const executable = (0, path_1.join)(dotCerbos, "cerbos");
console.log(executable);
let _client = null;
async function getLocalClient() {
    if (_client)
        return _client;
    const cmd = (0, child_process_1.spawn)(executable, [
        "server",
        "--config",
        (0, path_1.resolve)(dotCerbos, "config.yaml"),
    ]);
    cmd.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    cmd.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    // some sort of liveness check
    _client = new cerbos_1.Cerbos({
        hostname: "http://localhost:3592", // The Cerbos PDP instance
    });
    return _client;
}
path_1.default.join(__dirname, "../.cerbos/cerbos");
path_1.default.join(__dirname, "../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map