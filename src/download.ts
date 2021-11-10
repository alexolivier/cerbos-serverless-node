import { https } from "follow-redirects";
import fs from "fs";

export const download = (url: string, dest: string) => {
  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
      // check if response is success
      if (response.statusCode && response.statusCode >= 400) {
        return reject();
      }

      response.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on("finish", () => {
      file.close();
      resolve();
    });

    // check for request error too
    request.on("error", (e) => {
      console.error(e);
      // eslint-disable-next-line no-unused-vars
      fs.unlink(dest, (_) => {});
      reject();
    });

    // eslint-disable-next-line no-unused-vars
    file.on("error", (e) => {
      // Handle errors
      console.error(e);
      // eslint-disable-next-line no-unused-vars
      fs.unlink(dest, (_) => {}); // Delete the file async. (But we don't check the result)
      reject();
    });
  });
};
