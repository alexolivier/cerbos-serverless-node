import path from "path";
import { Cerbos } from "cerbos";
import spawn from "cross-spawn";

const moduleRoot = path.resolve(__dirname, "../");
const dotCerbos = path.resolve(moduleRoot, "../", ".cerbos");
const executable = path.join(dotCerbos, "cerbos");

const CERBOS_ENDPOINT = "http://localhost:3592";

let _client: Cerbos | null = null;

async function getLocalClient(): Promise<Cerbos> {
  if (_client) return _client;

  const cmd = spawn(
    executable,
    ["server", "--config", path.resolve(dotCerbos, "config.yaml")],
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
  // await livenessCheck(CERBOS_ENDPOINT);

  _client = new Cerbos({
    hostname: CERBOS_ENDPOINT, // The Cerbos PDP instance
  });

  return _client;
}

// async function livenessCheck(host: string): Promise<void> {

// }

path.join(__dirname, "../../.cerbos/cerbos");
path.join(__dirname, "../../.cerbos/config.yaml");

export default getLocalClient;
