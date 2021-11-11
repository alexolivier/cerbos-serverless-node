import path from "path";

import { Cerbos } from "cerbos";
import spawn from "cross-spawn";
import { cerbosDir } from "./get-paths";
import child_process from "child_process";
import http from "http";
import fs from "fs";
import { promisify } from "util";
import { createConfig } from "./create-config";
import tempDirectory from "temp-dir";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

const CERBOS_ENDPOINT = "http://localhost:3592";

async function getLocalClient(): Promise<Cerbos> {
  let cmd: child_process.ChildProcess;

  if (eval("__dirname").startsWith("/snapshot/")) {
    console.log(`moving to ${tempDirectory}`);

    const data = await readFile("../../.cerbos/cerbos");
    await writeFile(`${tempDirectory}/cerbos`, data);
    await chmod(`${tempDirectory}/cerbos`, "755");

    console.log("policy dir", path.join(process.cwd(), "../../policies"));

    await writeFile(
      `${tempDirectory}/config.yaml`,
      createConfig(path.join(process.cwd(), "../../policies"))
    );

    console.log(`moved to ${tempDirectory}`);
    console.log(
      "spwaning:",
      [
        `${tempDirectory}/cerbos`,
        "server",
        "--config",
        `${tempDirectory}/config.yaml}`,
      ].join(" ")
    );

    cmd = spawn(
      `${tempDirectory}/cerbos`,
      ["server", "--config", `${tempDirectory}/config.yaml`],
      {}
    );
  } else {
    console.log(
      "spwaning:",
      [
        "../../.cerbos/cerbos",
        "server",
        "--config",
        path.join(cerbosDir(), "config.yaml"),
      ].join(" ")
    );

    cmd = spawn(
      "../../.cerbos/cerbos",
      ["server", "--config", path.join(cerbosDir(), "config.yaml")],
      {}
    );
  }

  cmd.stdout?.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd.stderr?.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  await livenessCheck(`${CERBOS_ENDPOINT}/_cerbos/health`);

  return new Cerbos({
    hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
  });
}

async function livenessCheck(host: string): Promise<void> {
  return new Promise((resolve, reject) => {
    http
      .get(host)
      .on("error", () => {
        console.log("liveness check failed");
        setTimeout(() => {
          return livenessCheck(host).then(resolve, reject);
        }, 100);
      })
      .on("response", () => {
        console.log("liveness check passed");
        resolve();
      });
  });
}

path.join(__dirname, "../../../policies");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
