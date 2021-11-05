"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const promises_1 = require("fs/promises");
const moduleRoot = (0, path_1.resolve)(__dirname, "../../");
const dotCerbos = (0, path_1.resolve)(moduleRoot, ".cerbos");
async function getDownloadUrl() {
    const platform = process.platform;
    const arch = process.arch;
    console.log(platform, arch);
}
async function main() {
    console.log(moduleRoot);
    await (0, promises_1.rmdir)(dotCerbos, { recursive: true });
    await (0, promises_1.mkdir)(dotCerbos);
    const downloadUrl = await getDownloadUrl();
}
main();
//# sourceMappingURL=post-install.js.map