import path from "path";
import makeDir from "make-dir";
// import tempDir from "temp-dir";
import { promisify } from "util";
import fs from "fs";
import { https } from "follow-redirects";
var targz = require("tar.gz");

const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);
const rm = promisify(fs.rm);
const chmod = promisify(fs.chmod);
// const exists = promisify(fs.exists);
// const readFile = promisify(fs.readFile);
// const copyFile = promisify(fs.copyFile);

const VERSION = "0.9.1";

const binaryDir = path.join(__dirname, "../../../", ".cerbos");

const lockFile = path.join(binaryDir, "download-lock");

let createdLockFile = false;

const download = (url: string, dest: string) => {
  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
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
      fs.unlink(dest, (_) => {});
      reject();
    });

    // eslint-disable-next-line no-unused-vars
    file.on("error", () => {
      // Handle errors
      // eslint-disable-next-line no-unused-vars
      fs.unlink(dest, (_) => {}); // Delete the file async. (But we don't check the result)
      reject();
    });
  });
};

async function getDownloadUrl() {
  const platform = process.platform;
  const arch = process.arch;

  return `https://github.com/cerbos/cerbos/releases/download/v0.9.1/cerbos_${VERSION}_${platform}_${arch}.tar.gz`;
}

async function donwloadAndExtract(url: string, dest: string) {
  const bundle = path.join(dest, "engine.tar.gz");
  await download(url, bundle);
  await targz().extract(bundle, dest);
}

const createConfig = (policyPath: string) => {
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
  makeDir(binaryDir);
  if (
    fs.existsSync(lockFile) &&
    parseInt(fs.readFileSync(lockFile, "utf-8"), 10) > Date.now() - 20000
  ) {
    console.error(`Lock file already exists, skip downlaod of cerbos`);
  } else {
    createLockFile();
    console.log("clearing .cerbos");
    await rmdir(binaryDir, { recursive: true });
    console.log("creating .cerbos");
    await makeDir(binaryDir);
    console.log("downloading engine.tar.gz");
    const downloadUrl = await getDownloadUrl();
    await donwloadAndExtract(downloadUrl, binaryDir);
    console.log("delete tar.gz");
    await rm(path.join(binaryDir, "engine.tar.gz"));
    console.log("make executable");
    await chmod(path.join(binaryDir, "cerbos"), "755");
    console.log("make config");
    await writeFile(
      path.join(binaryDir, "config.yaml"),
      createConfig([binaryDir, "../..", "policies"].join("/"))
    );

    cleanupLockFile();
  }
}

function createLockFile() {
  createdLockFile = true;
  fs.writeFileSync(lockFile, Date.now().toString());
}

function cleanupLockFile() {
  if (createdLockFile) {
    try {
      if (fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch((e) => console.error(e));

// if we are in a Now context, ensure that `prisma generate` is in the postinstall hook
process.on("beforeExit", () => {
  cleanupLockFile();
});

process.once("SIGINT", () => {
  cleanupLockFile();
  process.exit();
});
