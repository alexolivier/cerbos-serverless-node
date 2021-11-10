"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donwloadAndExtract = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const download_1 = require("./download");
const tar_gz_1 = __importDefault(require("tar.gz"));
const get_paths_1 = require("./get-paths");
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const rm = (0, util_1.promisify)(fs_1.default.rm);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
async function donwloadAndExtract(url, dest) {
    const bundle = path_1.default.join(dest, "engine.tar.gz");
    await (0, download_1.download)(url, bundle);
    await (0, tar_gz_1.default)().extract(bundle, dest);
    const extractedBinary = path_1.default.join(dest, "cerbos");
    console.log("delete tar.gz");
    await rm(bundle);
    console.log("make executable");
    await chmod(extractedBinary, "755");
    const executablePath = (0, get_paths_1.getExecutablePath)();
    if (executablePath !== dest) {
        console.log("moving to tmp");
        const data = await readFile(extractedBinary);
        await writeFile(path_1.default.join(executablePath, "cerbos"), data);
        await chmod(path_1.default.join(executablePath, "cerbos"), "755");
    }
    console.log("binary location", executablePath);
}
exports.donwloadAndExtract = donwloadAndExtract;
//# sourceMappingURL=download-extract.js.map