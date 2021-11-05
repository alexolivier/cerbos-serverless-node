"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const promises_1 = require("fs/promises");
const fs_1 = __importDefault(require("fs"));
const follow_redirects_1 = require("follow-redirects");
var targz = require("tar.gz");
const VERSION = "0.9.1";
const moduleRoot = (0, path_1.resolve)(__dirname, "../../");
const dotCerbos = (0, path_1.resolve)(moduleRoot, ".cerbos");
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
    const bundle = (0, path_1.join)(dest, "engine.tar.gz");
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
    console.log("clearing .cerbos");
    await (0, promises_1.rmdir)(dotCerbos, { recursive: true });
    console.log("creating .cerbos");
    await (0, promises_1.mkdir)(dotCerbos);
    console.log("downloading engine.tar.gz");
    const downloadUrl = await getDownloadUrl();
    await donwloadAndExtract(downloadUrl, dotCerbos);
    console.log("delete tar.gz");
    await (0, promises_1.rm)((0, path_1.join)(dotCerbos, "engine.tar.gz"));
    console.log("make executable");
    await (0, promises_1.chmod)((0, path_1.join)(dotCerbos, "cerbos"), "755");
    console.log("make config");
    await (0, promises_1.writeFile)((0, path_1.join)(dotCerbos, "config.yaml"), createConfig([dotCerbos, "../../..", "policies"].join("/")));
}
main();
//# sourceMappingURL=post-install.js.map