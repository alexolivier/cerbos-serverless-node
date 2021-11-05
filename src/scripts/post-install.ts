import { resolve } from "path";
import { mkdir, rmdir } from "fs/promises";

const moduleRoot = resolve(__dirname, "../../");
const dotCerbos = resolve(moduleRoot, ".cerbos");

async function getDownloadUrl() {
  const platform = process.platform;
  const arch = process.arch;
  console.log(platform, arch);
}

async function main() {
  console.log(moduleRoot);
  await rmdir(dotCerbos, { recursive: true });
  await mkdir(dotCerbos);
  const downloadUrl = await getDownloadUrl();
}

main();
