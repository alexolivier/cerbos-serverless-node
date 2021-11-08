import path from "path";
import { Cerbos } from "cerbos";
import { spawn } from "child_process";

const moduleRoot = path.resolve(__dirname, "../");
const dotCerbos = path.resolve(moduleRoot, ".cerbos");
const executable = path.join(dotCerbos, "cerbos");

console.log(executable);

let _client: Cerbos | null = null;

async function getLocalClient(): Promise<Cerbos> {
  if (_client) return _client;

  const cmd = spawn(executable, [
    "server",
    "--config",
    path.resolve(dotCerbos, "config.yaml"),
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

path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
