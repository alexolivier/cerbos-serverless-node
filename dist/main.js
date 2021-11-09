"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cerbos_1 = require("cerbos");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const moduleRoot = path_1.default.resolve(__dirname, "../");
const dotCerbos = path_1.default.resolve(moduleRoot, "../", ".cerbos");
const executable = path_1.default.join(dotCerbos, "cerbos");
const CERBOS_ENDPOINT = "http://localhost:3592";
let _client = null;
async function getLocalClient() {
    if (_client)
        return _client;
    const cmd = (0, cross_spawn_1.default)(executable, ["server", "--config", path_1.default.resolve(dotCerbos, "config.yaml")], {});
    cmd.on("message", (data) => {
        console.log(`stdout: ${data}`);
    });
    cmd.on("error", (data) => {
        console.error(`stderr: ${data}`);
    });
    cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    // some sort of liveness check
    // await livenessCheck(CERBOS_ENDPOINT);
    _client = new cerbos_1.Cerbos({
        hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
    });
    return _client;
}
// async function livenessCheck(host: string): Promise<void> {
// }
path_1.default.join(__dirname, "../../.cerbos/cerbos");
path_1.default.join(__dirname, "../../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map