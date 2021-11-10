export const createConfig = (policyPath: string) => {
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
