import path from "path";
import fs from "fs";
import { Cerbos } from "cerbos";
import spawn from "cross-spawn";
import { cerbosDir, getExecutablePath } from "./get-paths";
import tempDirectory from "temp-dir";
import http from "http";

const executablePath = getExecutablePath();

const CERBOS_ENDPOINT = "http://localhost:3592";

let _client: Cerbos | null = null;

async function getLocalClient(): Promise<Cerbos> {
  if (_client) return _client;

  console.log(`==== listing ${executablePath}`);
  fs.readdirSync(executablePath).forEach((file) => {
    console.log(file);
  });
  console.log("===== end listing");

  console.log(`==== listing ${tempDirectory}`);
  fs.readdirSync(tempDirectory).forEach((file) => {
    console.log(file);
  });
  console.log("===== end listing");

  const cmd = spawn(
    path.join(executablePath, "cerbos"),
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
        }, 50);
      })
      .on("response", () => {
        console.log("liveness check passed");
        resolve();
      });
  });
}

path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
