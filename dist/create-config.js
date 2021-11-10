"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
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
exports.createConfig = createConfig;
//# sourceMappingURL=create-config.js.map