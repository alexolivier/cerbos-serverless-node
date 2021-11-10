"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cerbos_1 = require("cerbos");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const get_paths_1 = require("./get-paths");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const CERBOS_ENDPOINT = "http://localhost:3592";
let _client = null;
async function getLocalClient() {
    var _a, _b;
    if (_client)
        return _client;
    const binaryLocation = fs_1.default.readFileSync(path_1.default.join(__dirname, "binary-location"), "utf-8");
    console.log("binary location", binaryLocation);
    const cmd = (0, cross_spawn_1.default)(binaryLocation, ["server", "--config", path_1.default.resolve((0, get_paths_1.cerbosDir)(), "config.yaml")], {});
    (_a = cmd.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    (_b = cmd.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    // some sort of liveness check
    await livenessCheck(`${CERBOS_ENDPOINT}/_cerbos/health`);
    _client = new cerbos_1.Cerbos({
        hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
    });
    return _client;
}
async function livenessCheck(host) {
    return new Promise((resolve, reject) => {
        http_1.default
            .get(host)
            .on("error", () => {
            console.log("liveness check failed");
            setTimeout(() => {
                return livenessCheck(host).then(resolve, reject);
            }, 100);
        })
            .on("response", () => {
            console.log("liveness check passed");
            resolve();
        });
    });
}
path_1.default.join(__dirname, "binary-location");
path_1.default.join(__dirname, "../../.cerbos/cerbos");
path_1.default.join(__dirname, "../../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map