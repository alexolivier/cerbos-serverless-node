"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sdk_1 = require("@cerbos/sdk");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const temp_dir_1 = __importDefault(require("temp-dir"));
const CERBOS_ENDPOINT = "http://localhost:3592";
let _client = null;
async function getLocalClient() {
    if (_client)
        return _client;
    console.log(new Date(), "copying binary");
    const binaryData = fs_1.default.readFileSync(`${process.cwd()}/node_modules/.cerbos/cerbos`);
    fs_1.default.writeFileSync(`${temp_dir_1.default}/cerbos`, binaryData);
    fs_1.default.chmodSync(`${temp_dir_1.default}/cerbos`, "755");
    const configData = fs_1.default.readFileSync(`${process.cwd()}/node_modules/.cerbos/config.yaml`);
    fs_1.default.writeFileSync(`${temp_dir_1.default}/config.yaml`, configData);
    console.log(new Date(), "copying binary done");
    console.log(new Date(), "spwaning:", [
        `${temp_dir_1.default}/cerbos`,
        "server",
        "--config",
        `${temp_dir_1.default}/config.yaml`,
        `--set=storage.disk.directory=${process.cwd()}/policies`,
    ].join(" "), {
        stdio: "inherit",
        cwd: process.cwd(),
    });
    const cmd = (0, cross_spawn_1.default)(`${temp_dir_1.default}/cerbos`, [
        "server",
        "--config",
        `${temp_dir_1.default}/config.yaml`,
        `--set=storage.disk.directory=${process.cwd()}/policies`,
    ], {
        stdio: "inherit",
        cwd: process.cwd(),
    });
    cmd.on("close", (code) => {
        console.log(new Date(), `child process exited with code ${code}`);
    });
    await livenessCheck(`${CERBOS_ENDPOINT}/_cerbos/health`);
    _client = new sdk_1.Cerbos({
        hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
    });
    return _client;
}
async function livenessCheck(host) {
    return new Promise((resolve, reject) => {
        http_1.default
            .get(host)
            .on("error", () => {
            // console.log("liveness check failed");
            setTimeout(() => {
                return livenessCheck(host).then(resolve, reject);
            }, 100);
        })
            .on("response", () => {
            console.log(new Date(), "liveness check passed");
            resolve();
        });
    });
}
path_1.default.join(__dirname, "../../../policies");
path_1.default.join(__dirname, "../../.cerbos/cerbos");
path_1.default.join(__dirname, "../../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map