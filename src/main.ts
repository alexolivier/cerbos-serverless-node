import path from "path";
import { Cerbos } from "cerbos";
import spawn from "cross-spawn";
import http from "http";

import fs from "fs";
import tempDirectory from "temp-dir";

const CERBOS_ENDPOINT = "http://localhost:3592";

async function getLocalClient(): Promise<Cerbos> {
  console.log(new Date(), "copying binary");

  const binaryData = fs.readFileSync("./node_modules/.cerbos/cerbos");
  fs.writeFileSync(`${tempDirectory}/cerbos`, binaryData);
  fs.chmodSync(`${tempDirectory}/cerbos`, "755");

  const configData = fs.readFileSync("./node_modules/.cerbos/config.yaml");
  fs.writeFileSync(`${tempDirectory}/config.yaml`, configData);

  console.log(new Date(), "copying binary done");

  console.log(
    new Date(),
    "spwaning:",
    [
      `${tempDirectory}/cerbos`,
      "server",
      "--config",
      `${tempDirectory}/config.yaml`,
      `--set=storage.disk.directory=${process.cwd()}/policies`,
    ].join(" "),
    {
      stdio: "inherit",
      cwd: process.cwd(),
    }
  );

  const cmd = spawn(
    `${tempDirectory}/cerbos`,
    [
      `${tempDirectory}/cerbos`,
      "server",
      "--config",
      `${tempDirectory}/config.yaml`,
      `--set=storage.disk.directory=${process.cwd()}/policies`,
    ],
    {
      stdio: "inherit",
      cwd: process.cwd(),
    }
  );

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

path.join(__dirname, "../../../policies");
path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
