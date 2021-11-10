import path from "path";
import fs from "fs";

import { download } from "./download";
import { getExecutablePath } from "./get-paths";
import { promisify } from "util";

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
  if (executablePath !== destDir) {
    console.log("moving to tmp");
    const data = await readFile(cerbos);
    await writeFile(path.join(executablePath, "cerbos"), data);
    await chmod(path.join(executablePath, "cerbos"), "755");
  }
  console.log("binary location", executablePath);
}
