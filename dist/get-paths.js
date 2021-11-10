"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutablePath = exports.lockFile = exports.policyDir = exports.cerbosDir = void 0;
const path_1 = __importDefault(require("path"));
const cerbosDir = () => {
    return path_1.default.join(__dirname, "../../", ".cerbos");
};
exports.cerbosDir = cerbosDir;
const policyDir = () => {
    return path_1.default.join((0, exports.cerbosDir)(), "..", "policies");
};
exports.policyDir = policyDir;
const lockFile = () => {
    return path_1.default.join((0, exports.cerbosDir)(), "download-lock");
};
exports.lockFile = lockFile;
const getExecutablePath = () => {
    const _path = __dirname;
    if (_path.startsWith("/snapshot/")) {
        return "/tmp";
    }
    else {
        return (0, exports.cerbosDir)();
    }
};
exports.getExecutablePath = getExecutablePath;
//# sourceMappingURL=get-paths.js.map