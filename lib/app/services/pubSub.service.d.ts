export declare class PubSubService {
    private keyFile;
    private projectId;
    private pubSub;
    private topic;
    private session;
    constructor(keyFile: string, projectId: string);
    unsubscribe(): Promise<void>;
    subscribe(topicName: string, sessionId: string, callback: Function): Promise<void>;
    private getPubSubData;
    private createSession;
    private init;
}
