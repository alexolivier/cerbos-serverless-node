import path from "path";
import fs from "fs";

import { download } from "./download";
import targz from "tar.gz";
import { getExecutablePath } from "./get-paths";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);
const chmod = promisify(fs.chmod);

export async function donwloadAndExtract(url: string, dest: string) {
  const bundle = path.join(dest, "engine.tar.gz");
  await download(url, bundle);
  await targz().extract(bundle, dest);
  const extractedBinary = path.join(dest, "cerbos");
  console.log("delete tar.gz");
  await rm(bundle);
  console.log("make executable");
  await chmod(extractedBinary, "755");

  const executablePath = getExecutablePath();
  if (executablePath !== dest) {
    console.log("moving to tmp");
    const data = await readFile(extractedBinary);
    await writeFile(path.join(executablePath, "cerbos"), data);
    await chmod(path.join(executablePath, "cerbos"), "755");
  }
  console.log("binary location", executablePath);
}
