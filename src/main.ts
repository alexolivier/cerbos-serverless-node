import path, { resolve, join } from "path";
import { Cerbos } from "cerbos";
import { spawn } from "child_process";

const moduleRoot = resolve(__dirname, "../");
const dotCerbos = resolve(moduleRoot, ".cerbos");
const executable = join(dotCerbos, "cerbos");

console.log(executable);

let _client: Cerbos | null = null;

async function getLocalClient(): Promise<Cerbos> {
  if (_client) return _client;

  const cmd = spawn(executable, [
    "server",
    "--config",
    resolve(dotCerbos, "config.yaml"),
  ]);

  cmd.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  // some sort of liveness check

  _client = new Cerbos({
    hostname: "http://localhost:3592", // The Cerbos PDP instance
  });

  return _client;
}

path.join(__dirname, "../.cerbos/cerbos");
path.join(__dirname, "../.cerbos/config.yaml");

export default getLocalClient;
