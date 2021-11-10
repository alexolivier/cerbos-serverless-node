"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
// import tempDir from "temp-dir";
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const create_config_1 = require("./create-config");
const download_extract_1 = require("./download-extract");
const get_paths_1 = require("./get-paths");
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const rmdir = (0, util_1.promisify)(fs_1.default.rmdir);
// const exists = promisify(fs.exists);
// const readFile = promisify(fs.readFile);
// const copyFile = promisify(fs.copyFile);
const VERSION = "0.9.1";
const binaryDir = (0, get_paths_1.cerbosDir)();
const _lockFile = (0, get_paths_1.lockFile)();
let createdLockFile = false;
async function getDownloadUrl() {
    const platform = process.platform;
    const arch = process.arch;
    return `https://github.com/cerbos/cerbos/releases/download/v0.9.1/cerbos_${VERSION}_${platform}_${arch}.tar.gz`;
}
async function main() {
    (0, make_dir_1.default)(binaryDir);
    if (fs_1.default.existsSync(_lockFile) &&
        parseInt(fs_1.default.readFileSync(_lockFile, "utf-8"), 10) > Date.now() - 20000) {
        console.error(`Lock file already exists, skip downlaod of cerbos`);
    }
    else {
        createLockFile();
        console.log("clearing .cerbos");
        await rmdir(binaryDir, { recursive: true });
        console.log("creating .cerbos");
        await (0, make_dir_1.default)(binaryDir);
        console.log("downloading engine.tar.gz");
        const downloadUrl = await getDownloadUrl();
        await (0, download_extract_1.donwloadAndExtract)(downloadUrl, binaryDir);
        console.log("make config");
        await writeFile(path_1.default.join(binaryDir, "config.yaml"), (0, create_config_1.createConfig)([binaryDir, "..", "policies"].join("/")));
        cleanupLockFile();
    }
}
function createLockFile() {
    createdLockFile = true;
    fs_1.default.writeFileSync(_lockFile, Date.now().toString());
}
function cleanupLockFile() {
    if (createdLockFile) {
        try {
            if (fs_1.default.existsSync(_lockFile)) {
                fs_1.default.unlinkSync(_lockFile);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
main().catch((e) => console.error(e));
process.on("beforeExit", () => {
    cleanupLockFile();
});
process.once("SIGINT", () => {
    cleanupLockFile();
    process.exit();
});
//# sourceMappingURL=post-install.js.map