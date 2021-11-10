import path from "path";
import makeDir from "make-dir";
import { promisify } from "util";
import fs from "fs";
import { createConfig } from "./create-config";
import { donwloadAndExtract } from "./download-extract";
import { cerbosDir, lockFile, policyDir } from "./get-paths";

const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);

// const exists = promisify(fs.exists);
// const readFile = promisify(fs.readFile);
// const copyFile = promisify(fs.copyFile);

const VERSION = "0.9.1";

const binaryDir = cerbosDir();

const _lockFile = lockFile();

let createdLockFile = false;

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function getDownloadUrl() {
  const platform = process.platform;
  const arch = process.arch;
  return `https://storage.googleapis.com/cerbos-ao-dev/cerbos_${VERSION}_${toTitleCase(
    platform
  )}_${arch}/cerbos`;
  // return `https://github.com/cerbos/cerbos/releases/download/v0.9.1/cerbos_${VERSION}_${platform}_${arch}.tar.gz`;
}

async function main() {
  makeDir(binaryDir);
  if (
    fs.existsSync(_lockFile) &&
    parseInt(fs.readFileSync(_lockFile, "utf-8"), 10) > Date.now() - 20000
  ) {
    console.error(`Lock file already exists, skip downlaod of cerbos`);
  } else {
    createLockFile();
    console.log("clearing .cerbos");
    await rmdir(binaryDir, { recursive: true });
    console.log("creating .cerbos");
    await makeDir(binaryDir);
    console.log("downloading cerbos");
    const downloadUrl = await getDownloadUrl();
    console.log(`downloading from ${downloadUrl}`);
    await donwloadAndExtract(downloadUrl, binaryDir);
    console.log("make config");
    await writeFile(
      path.join(binaryDir, "config.yaml"),
      createConfig(policyDir())
    );

    cleanupLockFile();
  }
}

function createLockFile() {
  createdLockFile = true;
  fs.writeFileSync(_lockFile, Date.now().toString());
}

function cleanupLockFile() {
  if (createdLockFile) {
    try {
      if (fs.existsSync(_lockFile)) {
        fs.unlinkSync(_lockFile);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch((e) => console.error(e));

process.on("beforeExit", () => {
  cleanupLockFile();
});

process.once("SIGINT", () => {
  cleanupLockFile();
  process.exit();
});

path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");
