"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donwloadAndExtract = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const download_1 = require("./download");
// import { getExecutablePath } from "./get-paths";
const util_1 = require("util");
// import tempDirectory from "temp-dir";
// const readFile = promisify(fs.readFile);
// const writeFile = promisify(fs.writeFile);
// const rm = promisify(fs.rm);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
async function donwloadAndExtract(url, destDir) {
    const cerbos = path_1.default.join(destDir, "cerbos");
    await (0, download_1.download)(url, cerbos);
    console.log("make executable");
    await chmod(cerbos, "755");
    // const executablePath = getExecutablePath();
    // // if (process.env.NOW_REGION || eval("__dirname").startsWith("/snapshot/")) {
    // //   console.log("moving to tmp");
    // //   const data = await readFile(cerbos);
    // //   const tmpLocation = path.join(tempDirectory, "cerbos");
    // //   await writeFile(tmpLocation, data);
    // //   await chmod(tmpLocation, "755");
    // //   console.log("binary location", tmpLocation);
    // // } else {
    // //   console.log("binary location", executablePath);
    // // }
}
exports.donwloadAndExtract = donwloadAndExtract;
//# sourceMappingURL=download-extract.js.map