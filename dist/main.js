"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cerbos_1 = require("cerbos");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const temp_dir_1 = __importDefault(require("temp-dir"));
const CERBOS_ENDPOINT = "http://localhost:3592";
async function getLocalClient() {
    var _a, _b;
    console.log("__dirname", __dirname);
    console.log("eval('__dirname')", eval("__dirname"));
    console.log("process.cwd()", process.cwd());
    console.log(`=== files: ${temp_dir_1.default}`);
    fs_1.default.readdirSync(temp_dir_1.default).forEach((file) => {
        console.log(file);
    });
    console.log(`=== files: ${process.cwd()}/node_modules/.cerbos`);
    fs_1.default.readdirSync(`${process.cwd()}/node_modules/.cerbos`).forEach((file) => {
        console.log(file);
    });
    console.log("===");
    console.log("spwaning:", [
        `${process.cwd()}/node_modules/.cerbos/cerbos`,
        "server",
        "--config",
        `${process.cwd()}/node_modules/.cerbos/config.yaml`,
    ].join(" "));
    const cmd = (0, cross_spawn_1.default)(`${process.cwd()}/node_modules/.cerbos/cerbos`, ["server", "--config", `${process.cwd()}/node_modules/.cerbos/config.yaml`], {});
    (_a = cmd.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    (_b = cmd.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
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
path_1.default.join(process.cwd(), "/policies");
path_1.default.join(process.cwd(), "/node_modules/.cerbos/cerbos");
path_1.default.join(process.cwd(), "/node_modules/.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map