import { PubSub } from "@google-cloud/pubsub";
import { IPubSubNotification } from "../../interfaces";

export class PubSubService {
  private pubSub: PubSub;
  private topic: string;
  private session: string;

  constructor(private keyFile: string, private projectId: string) {
    this.init();
  }

  public async unsubscribe() {
    // Connect to the pubsub topic
    const topic = await this.pubSub.topic(this.topic);

    // Get the subscription
    const sub = await topic.subscription(this.session);

    // Delete the subscription
    await sub.delete();
  }

  public async subscribe(
    topicName: string,
    sessionId: string,
    callback: Function
  ): Promise<void> {
    // Create sessionId
    this.createSession(sessionId, topicName);

    // Connect to the pubsub topic
    const topic = await this.pubSub.topic(this.topic);
    console.log("topic");
    console.log(topic);

    // // Create the unique subscription
    // await topic.createSubscription(this.session);
    // console.log("Created sub");

    // // Delay 2 seconds
    // await this.delay(2);

    // Connect to the subscription
    const subscription = await topic.subscription(this.session);
    console.log("Got subscription");

    // Setup handler
    subscription.on("message", (msg: any) => {
      // Parse the incoming data
      const data = this.getPubSubData(msg);

      // Awk the message
      msg.ack();

      // Handoff to callback function
      callback(data);
    });
  }

  private delay(seconds: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

  private getPubSubData(raw: any): IPubSubNotification {
    const json = Buffer.from(raw.data, "base64").toString();
    return JSON.parse(json);
  }

  private createSession(id: string, topic: string) {
    this.topic = topic;
    this.session = "proxy-api-repo";
  }

  private init() {
    // Create connection to PubSub
    this.pubSub = new PubSub({
      projectId: this.projectId,
      keyFilename: this.keyFile
    });
  }
}
