"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cerbos_1 = require("cerbos");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const http_1 = __importDefault(require("http"));
const CERBOS_ENDPOINT = "http://localhost:3592";
async function getLocalClient() {
    console.log(new Date(), "spwaning:", [
        path_1.default.join(__dirname, "../../.cerbos/cerbos"),
        "server",
        "--config",
        path_1.default.join(__dirname, "../../.cerbos/config.yaml"),
    ].join(" "), {
        stdio: "inherit",
        cwd: process.cwd(),
    });
    const cmd = (0, cross_spawn_1.default)(path_1.default.join(__dirname, "../../.cerbos/cerbos"), ["server", "--config", path_1.default.join(__dirname, "../../.cerbos/config.yaml")], {
        stdio: "inherit",
        cwd: process.cwd(),
    });
    cmd.on("close", (code) => {
        console.log(new Date(), `child process exited with code ${code}`);
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