import path from "path";
import fs from "fs";

import { download } from "./download";
import targz from "tar.gz";
import { getExecutablePath } from "./get-paths";
import { promisify } from "util";

const copyFile = promisify(fs.copyFile);
const rm = promisify(fs.rm);
const chmod = promisify(fs.chmod);

export async function donwloadAndExtract(url: string, dest: string) {
  const bundle = path.join(dest, "engine.tar.gz");
  await download(url, bundle);
  await targz().extract(bundle, dest);
  console.log("delete tar.gz");
  await rm(bundle);
  console.log("make executable");
  await chmod(path.join(dest, "cerbos"), "755");
  const executablePath = getExecutablePath();
  if (executablePath !== dest) {
    await copyFile(path.join(dest, "cerbos"), executablePath);
  }
}
