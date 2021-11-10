import path from "path";

import { Cerbos } from "cerbos";
import spawn from "cross-spawn";
import { cerbosDir } from "./get-paths";
import http from "http";
import fs from "fs";

const CERBOS_ENDPOINT = "http://localhost:3592";

let _client: Cerbos | null = null;

async function getLocalClient(): Promise<Cerbos> {
  if (_client) return _client;

  const binaryLocation = JSON.parse(
    fs.readFileSync(path.join(__dirname, "pdp.json"), "utf-8")
  );

  console.log("binary location", binaryLocation.pdp);

  const cmd = spawn(
    binaryLocation.pdp,
    ["server", "--config", path.resolve(cerbosDir(), "config.yaml")],
    {}
  );

  cmd.stdout?.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd.stderr?.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  // some sort of liveness check
  await livenessCheck(`${CERBOS_ENDPOINT}/_cerbos/health`);

  _client = new Cerbos({
    hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
  });

  return _client;
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

path.join(__dirname, "pdp.json");
path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
