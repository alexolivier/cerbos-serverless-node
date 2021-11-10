import path from "path";
import fs from "fs";

import { download } from "./download";
import { getExecutablePath } from "./get-paths";
import { promisify } from "util";
import tempDirectory from "temp-dir";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
// const rm = promisify(fs.rm);
const chmod = promisify(fs.chmod);

export async function donwloadAndExtract(url: string, destDir: string) {
  const cerbos = path.join(destDir, "cerbos");
  await download(url, cerbos);
  // console.log(bundle, dest);
  // console.log(`extracting ${bundle} to ${dest}`);
  // await tar.Extract({
  //   file: bundle,
  //   cwd: dest,
  // });
  // console.log("extracted");
  // console.log(`==== listing ${dest}`);
  // fs.readdirSync(dest).forEach((file) => {
  //   console.log(file);
  // });
  // console.log("===== end listing");

  // const extractedBinary = path.join(dest, "cerbos");
  // console.log("delete tar.gz");
  // await rm(bundle);
  console.log("make executable");
  await chmod(cerbos, "755");

  const executablePath = getExecutablePath();

  const _path = eval("__dirname");

  if (_path.startsWith("/snapshot/")) {
    console.log("moving to tmp");
    const data = await readFile(cerbos);
    await writeFile(path.join(tempDirectory, "cerbos"), data);
    await chmod(path.join(tempDirectory, "cerbos"), "755");
    fs.writeFileSync(
      path.join(_path, "binary-location"),
      path.join(tempDirectory, "cerbos")
    );
  } else {
    fs.writeFileSync(path.join(_path, "binary-location"), cerbos);
  }

  console.log("binary location", executablePath);
}
