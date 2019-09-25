import * as child_process from "child_process";
import * as uuid from "uuid/v4";
import { IAppConfig, IPubSubNotification, IRepoConfig } from "../interfaces";
import { PubSubService } from "./services/pubSub.service";

export class App {
  private pubSub: PubSubService;

  constructor(private config: IAppConfig) {
    this.init();

    // Start the app
    this.startApp();
  }

  private startApp() {
    // Start the subscription
    this.subscribeToPubSub();

    // Setup exit handler
    process.on("SIGINT", async () => {
      console.log("Shutting down...");

      // Unsubscribe from pubsub
      // await this.pubSub.unsubscribe();

      // Exit
      process.exit();
    });

    // ... that's all folks
  }

  private subscribeToPubSub(): void {
    // Get a new session id
    const sessionId: string = this.createSessionID();

    console.log("Starting subscription...");

    // Setup subscription
    this.pubSub.subscribe(
      this.config.topic,
      sessionId,
      (data: IPubSubNotification) => {
        console.log("GOT DATA");
        // Loop through all of the configs
        for (let config of this.config.configs) {
          // Validate the repository
          if (!this.isCorrectRepository(data, config)) {
            continue;
          }

          // Validate the branch
          if (!this.isCorrectBranch(data, config)) {
            continue;
          }

          console.log("Executing script for config");
          console.log(config);

          // Execute the script
          this.executeScript(config);
        }
      }
    );
  }

  private isCorrectRepository(
    data: IPubSubNotification,
    config: IRepoConfig
  ): boolean {
    console.log(data.name + " vs. " + config.repository);
    return data.name === config.repository;
  }

  private isCorrectBranch(
    data: IPubSubNotification,
    config: IRepoConfig
  ): boolean {
    // Cast the ref updates to an array
    const refs = Object.keys(data.refUpdateEvent.refUpdates);

    // Check if the branch name is in the array
    return refs.find(r => r === config.branch) ? true : false;
  }

  private executeScript(config: IRepoConfig): void {
    // Execute the attached script
    child_process.exec(
      `sh ${config.shellScript}`,
      (error: Error, stdout: string, stderr: string) => {
        if (error) {
          console.log("Eror running shell script");
          console.log(error);
          return;
        }

        console.log(stdout);
        console.log(stderr);
      }
    );
  }

  private createSessionID(): string {
    // Use the uuid/v4 library to create unique ids
    return uuid();
  }

  private init() {
    // Build required services
    this.pubSub = new PubSubService(this.config.keyFile, this.config.projectId);
  }
}
