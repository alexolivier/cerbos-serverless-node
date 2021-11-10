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
const temp_dir_1 = __importDefault(require("temp-dir"));
const CERBOS_ENDPOINT = "http://localhost:3592";
async function getLocalClient() {
    var _a;
    const cmd = (0, cross_spawn_1.default)(process.env.NOW_REGION ? `${temp_dir_1.default}/cerbos` : "../../.cerbos/cerbos", ["server", "--config", path_1.default.resolve((0, get_paths_1.cerbosDir)(), "config.yaml")], {});
    // cmd.stdout?.on("data", (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    (_a = cmd.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    await livenessCheck(`${CERBOS_ENDPOINT}/_cerbos/health`);
    return new cerbos_1.Cerbos({
        hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
    });
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
path_1.default.join(__dirname, "../../.cerbos/cerbos");
path_1.default.join(__dirname, "../../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map