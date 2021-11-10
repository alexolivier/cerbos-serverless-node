"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donwloadAndExtract = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const download_1 = require("./download");
const get_paths_1 = require("./get-paths");
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
// const rm = promisify(fs.rm);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
async function donwloadAndExtract(url, destDir) {
    const cerbos = path_1.default.join(destDir, "cerbos");
    await (0, download_1.download)(url, cerbos);
    // console.log(bundle, dest);
    // console.log(`extracting ${bundle} to ${dest}`);
    // await tar.Extract({
    //   file: bundle,
    //   cwd: dest,
    // });
    // console.log("extracted");
    // console.log(`==== listing ${dest}`);
    // fs.readdirSync(dest).forEach((file) => {
    //   console.log(file);
    // });
    // console.log("===== end listing");
    // const extractedBinary = path.join(dest, "cerbos");
    // console.log("delete tar.gz");
    // await rm(bundle);
    console.log("make executable");
    await chmod(cerbos, "755");
    const executablePath = (0, get_paths_1.getExecutablePath)();
    if (executablePath !== destDir) {
        console.log("moving to tmp");
        const data = await readFile(cerbos);
        await writeFile(path_1.default.join(executablePath, "cerbos"), data);
        await chmod(path_1.default.join(executablePath, "cerbos"), "755");
    }
    console.log("binary location", executablePath);
}
exports.donwloadAndExtract = donwloadAndExtract;
//# sourceMappingURL=download-extract.js.map