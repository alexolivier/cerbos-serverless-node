import path from "path";
import tempDir from "temp-dir";

export const cerbosDir = () => {
  return path.join(__dirname, "../..", ".cerbos");
};

export const policyDir = () => {
  return path.join(cerbosDir(), "../..", "policies");
};

export const lockFile = () => {
  return path.join(cerbosDir(), "download-lock");
};

export const getExecutablePath = () => {
  const _path = eval("__dirname");
  console.log(`getExecutablePath ${_path}`);
  console.log(`tempDir ${tempDir}`);
  if (_path.startsWith("/snapshot/")) {
    return tempDir;
  } else {
    return cerbosDir();
  }
};
