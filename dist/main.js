"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cerbos_1 = require("cerbos");
const child_process_1 = require("child_process");
const moduleRoot = path_1.default.resolve(__dirname, "../");
const dotCerbos = path_1.default.resolve(moduleRoot, ".cerbos");
const executable = path_1.default.join(dotCerbos, "cerbos");
console.log(executable);
let _client = null;
async function getLocalClient() {
    if (_client)
        return _client;
    const cmd = (0, child_process_1.spawn)(executable, [
        "server",
        "--config",
        path_1.default.resolve(dotCerbos, "config.yaml"),
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