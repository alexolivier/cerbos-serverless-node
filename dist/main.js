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
const util_1 = require("util");
const create_config_1 = require("./create-config");
const temp_dir_1 = __importDefault(require("temp-dir"));
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
const CERBOS_ENDPOINT = "http://localhost:3592";
async function getLocalClient() {
    var _a, _b;
    let cmd;
    if (eval("__dirname").startsWith("/snapshot/")) {
        console.log(`moving to ${temp_dir_1.default}`);
        const data = await readFile("../../.cerbos/cerbos");
        await writeFile(`${temp_dir_1.default}/cerbos`, data);
        await chmod(`${temp_dir_1.default}/cerbos`, "755");
        console.log("policy dir", path_1.default.join(process.cwd(), "./policies"));
        await writeFile(`${temp_dir_1.default}/config.yaml`, (0, create_config_1.createConfig)(path_1.default.join(process.cwd(), "./policies")));
        console.log(`moved to ${temp_dir_1.default}`);
        console.log("spwaning:", [
            `${temp_dir_1.default}/cerbos`,
            "server",
            "--config",
            `${temp_dir_1.default}/config.yaml}`,
        ].join(" "));
        cmd = (0, cross_spawn_1.default)(`${temp_dir_1.default}/cerbos`, ["server", "--config", `${temp_dir_1.default}/config.yaml`], {});
    }
    else {
        console.log("spwaning:", [
            "../../.cerbos/cerbos",
            "server",
            "--config",
            path_1.default.join((0, get_paths_1.cerbosDir)(), "config.yaml"),
        ].join(" "));
        cmd = (0, cross_spawn_1.default)("../../.cerbos/cerbos", ["server", "--config", path_1.default.join((0, get_paths_1.cerbosDir)(), "config.yaml")], {});
    }
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
path_1.default.join(__dirname, "../../../policies");
path_1.default.join(__dirname, "../../.cerbos/config.yaml");
exports.default = getLocalClient;
//# sourceMappingURL=main.js.map