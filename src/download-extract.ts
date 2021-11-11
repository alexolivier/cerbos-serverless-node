import path from "path";
import fs from "fs";

import { download } from "./download";
// import { getExecutablePath } from "./get-paths";
import { promisify } from "util";
// import tempDirectory from "temp-dir";

// const readFile = promisify(fs.readFile);
// const writeFile = promisify(fs.writeFile);
// const rm = promisify(fs.rm);
const chmod = promisify(fs.chmod);

export async function donwloadAndExtract(url: string, destDir: string) {
  const cerbos = path.join(destDir, "cerbos");
  await download(url, cerbos);

  console.log("make executable");
  await chmod(cerbos, "755");

  // const executablePath = getExecutablePath();
  // // if (process.env.NOW_REGION || eval("__dirname").startsWith("/snapshot/")) {
  // //   console.log("moving to tmp");
  // //   const data = await readFile(cerbos);
  // //   const tmpLocation = path.join(tempDirectory, "cerbos");
  // //   await writeFile(tmpLocation, data);
  // //   await chmod(tmpLocation, "755");
  // //   console.log("binary location", tmpLocation);
  // // } else {
  // //   console.log("binary location", executablePath);
  // // }
}
