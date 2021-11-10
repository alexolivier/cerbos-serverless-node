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
const temp_dir_1 = __importDefault(require("temp-dir"));
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
// const rm = promisify(fs.rm);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
async function donwloadAndExtract(url, destDir) {
    const cerbos = path_1.default.join(destDir, "cerbos");
    await (0, download_1.download)(url, cerbos);
    console.log("make executable");
    await chmod(cerbos, "755");
    const executablePath = (0, get_paths_1.getExecutablePath)();
    const _path = eval("__dirname");
    const pdpJson = path_1.default.join(_path, "pdp.json");
    if (_path.startsWith("/snapshot/")) {
        console.log("moving to tmp");
        const data = await readFile(cerbos);
        await writeFile(path_1.default.join(temp_dir_1.default, "cerbos"), data);
        await chmod(path_1.default.join(temp_dir_1.default, "cerbos"), "755");
        fs_1.default.writeFileSync(pdpJson, JSON.stringify({ pdp: path_1.default.join(temp_dir_1.default, "cerbos") }));
    }
    else {
        fs_1.default.writeFileSync(pdpJson, JSON.stringify({ pdp: cerbos }));
    }
    console.log("binary location", executablePath);
}
exports.donwloadAndExtract = donwloadAndExtract;
//# sourceMappingURL=download-extract.js.map