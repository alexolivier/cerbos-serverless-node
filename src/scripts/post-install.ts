import { resolve, join } from "path";
import { mkdir, rmdir, rm, chmod, writeFile } from "fs/promises";
import fs from "fs";
import { https } from "follow-redirects";
var targz = require("tar.gz");

const VERSION = "0.9.1";

const moduleRoot = resolve(__dirname, "../../../../");
const dotCerbos = resolve(moduleRoot, ".cerbos");

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
  const bundle = join(dest, "engine.tar.gz");
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
  console.log("clearing .cerbos");
  await rmdir(dotCerbos, { recursive: true });
  console.log(`creating .cerbos: ${dotCerbos}`);
  await mkdir(dotCerbos);
  console.log("downloading engine.tar.gz");
  const downloadUrl = await getDownloadUrl();
  await donwloadAndExtract(downloadUrl, dotCerbos);
  console.log("delete tar.gz");
  await rm(join(dotCerbos, "engine.tar.gz"));
  console.log("make executable");
  await chmod(join(dotCerbos, "cerbos"), "755");
  console.log("make config");
  await writeFile(
    join(dotCerbos, "config.yaml"),
    createConfig([dotCerbos, "../", "policies"].join("/"))
  );
}

main();
