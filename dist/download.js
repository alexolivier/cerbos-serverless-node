"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const follow_redirects_1 = require("follow-redirects");
const fs_1 = __importDefault(require("fs"));
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
exports.download = download;
//# sourceMappingURL=download.js.map