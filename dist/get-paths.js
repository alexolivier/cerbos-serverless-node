"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutablePath = exports.lockFile = exports.policyDir = exports.cerbosDir = void 0;
const path_1 = __importDefault(require("path"));
const temp_dir_1 = __importDefault(require("temp-dir"));
const cerbosDir = () => {
    return path_1.default.join(__dirname, "../..", ".cerbos");
};
exports.cerbosDir = cerbosDir;
const policyDir = () => {
    return path_1.default.join((0, exports.cerbosDir)(), "../..", "policies");
};
exports.policyDir = policyDir;
const lockFile = () => {
    return path_1.default.join((0, exports.cerbosDir)(), "download-lock");
};
exports.lockFile = lockFile;
const getExecutablePath = () => {
    const _path = eval("__dirname");
    console.log("_path", _path);
    if (_path.startsWith("/snapshot/")) {
        return temp_dir_1.default;
    }
    else {
        return (0, exports.cerbosDir)();
    }
};
exports.getExecutablePath = getExecutablePath;
//# sourceMappingURL=get-paths.js.map