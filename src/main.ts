import path from "path";
import { Cerbos } from "cerbos";
import spawn from "cross-spawn";
import http from "http";
import fs from "fs";

import tempDirectory from "temp-dir";

const CERBOS_ENDPOINT = "http://localhost:3592";

async function getLocalClient(): Promise<Cerbos> {
  console.log("__dirname", __dirname);
  console.log("eval('__dirname')", eval("__dirname"));
  console.log("process.cwd()", process.cwd());

  console.log(`=== files: ${tempDirectory}`);
  fs.readdirSync(tempDirectory).forEach((file) => {
    console.log(file);
  });

  console.log(`=== files: ${process.cwd()}/node_modules/.cerbos`);
  fs.readdirSync(`${process.cwd()}/node_modules/.cerbos`).forEach((file) => {
    console.log(file);
  });

  console.log("===");

  console.log(
    new Date(),
    "spwaning:",
    [
      `${process.cwd()}/node_modules/.cerbos/cerbos`,
      "server",
      "--config",
      `${process.cwd()}/node_modules/.cerbos/config.yaml`,
    ].join(" ")
  );

  const cmd = spawn(
    `${process.cwd()}/node_modules/.cerbos/cerbos`,
    ["server", "--config", `${process.cwd()}/node_modules/.cerbos/config.yaml`],
    {}
  );

  cmd.stdout?.on("data", (data) => {
    console.log(new Date(), `stdout: ${data}`);
  });

  cmd.stderr?.on("data", (data) => {
    console.error(new Date(), `stderr: ${data}`);
  });

  cmd.on("close", (code) => {
    console.log(new Date(), `child process exited with code ${code}`);
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
        // console.log("liveness check failed");
        setTimeout(() => {
          return livenessCheck(host).then(resolve, reject);
        }, 100);
      })
      .on("response", () => {
        console.log(new Date(), "liveness check passed");
        resolve();
      });
  });
}

path.join(process.cwd(), "/policies");
path.join(process.cwd(), "/node_modules/.cerbos/cerbos");
path.join(process.cwd(), "/node_modules/.cerbos/config.yaml");

export default getLocalClient;
