"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
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
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map