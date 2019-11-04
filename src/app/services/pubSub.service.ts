import { PubSub } from "@google-cloud/pubsub";
import * as uuid from "uuid/v1";
import { IPubSubNotification } from "../../interfaces";

export class PubSubService {
  private pubSub: PubSub;
  private topic: string;
  private session: string;

  constructor(
    private keyFile: string,
    private projectId: string,
    private subId: string
  ) {
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
    await this.createSession(sessionId, topicName);

    // Connect to the pubsub topic
    const topic = await this.pubSub.topic(this.topic);

    // Connect to the subscription
    const subscription = await topic.subscription(this.session);

    // Setup handler
    subscription.on("message", (msg: any) => {
      // Parse the incoming data
      const data = this.getPubSubData(msg);

      // Ack the message
      msg.ack();

      // Handoff to callback function
      callback(data);
    });
  }

  private getPubSubData(raw: any): IPubSubNotification {
    const json = Buffer.from(raw.data, "base64").toString();
    return JSON.parse(json);
  }

  private async createSession(id: string, topic: string) {
    this.topic = topic;

    // Create a new subscription with google pub sub
    const sub = uuid();
    await this.pubSub.topic(this.topic).createSubscription(sub);

    // Set the new subscription
    this.session = sub;
  }

  private init() {
    // Create connection to PubSub
    this.pubSub = new PubSub({
      projectId: this.projectId,
      keyFilename: this.keyFile
    });
  }
}
