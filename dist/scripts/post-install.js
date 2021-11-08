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
const follow_redirects_1 = require("follow-redirects");
var targz = require("tar.gz");
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const rmdir = (0, util_1.promisify)(fs_1.default.rmdir);
const rm = (0, util_1.promisify)(fs_1.default.rm);
const chmod = (0, util_1.promisify)(fs_1.default.chmod);
// const exists = promisify(fs.exists);
// const readFile = promisify(fs.readFile);
// const copyFile = promisify(fs.copyFile);
const VERSION = "0.9.1";
const binaryDir = path_1.default.join(__dirname, "../../../", ".cerbos");
const lockFile = path_1.default.join(binaryDir, "download-lock");
let createdLockFile = false;
const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs_1.default.createWriteStream(dest);
        const request = follow_redirects_1.https.get(url, (response) => {
            // check if response is success
            if (response.statusCode && response.statusCode >= 400) {
                return reject();
            }
            response.pipe(file);
        });
        // close() is async, call cb after close completes
        file.on("finish", () => {
            file.close();
            resolve();
        });
        // check for request error too
        request.on("error", () => {
            // eslint-disable-next-line no-unused-vars
            fs_1.default.unlink(dest, (_) => { });
            reject();
        });
        // eslint-disable-next-line no-unused-vars
        file.on("error", () => {
            // Handle errors
            // eslint-disable-next-line no-unused-vars
            fs_1.default.unlink(dest, (_) => { }); // Delete the file async. (But we don't check the result)
            reject();
        });
    });
};
async function getDownloadUrl() {
    const platform = process.platform;
    const arch = process.arch;
    return `https://github.com/cerbos/cerbos/releases/download/v0.9.1/cerbos_${VERSION}_${platform}_${arch}.tar.gz`;
}
async function donwloadAndExtract(url, dest) {
    const bundle = path_1.default.join(dest, "engine.tar.gz");
    await download(url, bundle);
    await targz().extract(bundle, dest);
}
const createConfig = (policyPath) => {
    return `
---
server:
  httpListenAddr: ":3592"
storage:
  driver: "disk"
  disk:
    directory: ${policyPath}
    watchForChanges: false
`;
};
async function main() {
    (0, make_dir_1.default)(binaryDir);
    if (fs_1.default.existsSync(lockFile) &&
        parseInt(fs_1.default.readFileSync(lockFile, "utf-8"), 10) > Date.now() - 20000) {
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
        await donwloadAndExtract(downloadUrl, binaryDir);
        console.log("delete tar.gz");
        await rm(path_1.default.join(binaryDir, "engine.tar.gz"));
        console.log("make executable");
        await chmod(path_1.default.join(binaryDir, "cerbos"), "755");
        console.log("make config");
        await writeFile(path_1.default.join(binaryDir, "config.yaml"), createConfig([binaryDir, "../..", "policies"].join("/")));
        cleanupLockFile();
    }
}
function createLockFile() {
    createdLockFile = true;
    fs_1.default.writeFileSync(lockFile, Date.now().toString());
}
function cleanupLockFile() {
    if (createdLockFile) {
        try {
            if (fs_1.default.existsSync(lockFile)) {
                fs_1.default.unlinkSync(lockFile);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
main().catch((e) => console.error(e));
// if we are in a Now context, ensure that `prisma generate` is in the postinstall hook
process.on("beforeExit", () => {
    cleanupLockFile();
});
process.once("SIGINT", () => {
    cleanupLockFile();
    process.exit();
});
//# sourceMappingURL=post-install.js.map