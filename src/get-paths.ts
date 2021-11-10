import path from "path";

export const cerbosDir = () => {
  return path.join(__dirname, "../../", ".cerbos");
};

export const policyDir = () => {
  return path.join(cerbosDir(), "..", "policies");
};

export const lockFile = () => {
  return path.join(cerbosDir(), "download-lock");
};

export const getExecutablePath = () => {
  const _path = eval(__dirname);
  if (_path.startsWith("/snapshot/")) {
    return path.join("/tmp");
  } else {
    return path.join(cerbosDir());
  }
};
