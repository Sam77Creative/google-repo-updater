import * as fs from "fs";
import { App } from "./app/app";
import { IAppConfig } from "./interfaces";

export function run(configFile: string) {
  // Load the config file
  let config: IAppConfig;
  try {
    config = JSON.parse(fs.readFileSync(configFile).toString());
  } catch (e) {
    console.log("Failed to load the config file");
    console.log(e);
    return;
  }

  // Pass the data to the app
  const app = new App(config);
}
