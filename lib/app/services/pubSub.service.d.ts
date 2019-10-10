export declare class PubSubService {
    private keyFile;
    private projectId;
    private subId;
    private pubSub;
    private topic;
    private session;
    constructor(keyFile: string, projectId: string, subId: string);
    unsubscribe(): Promise<void>;
    subscribe(topicName: string, sessionId: string, callback: Function): Promise<void>;
    private getPubSubData;
    private createSession;
    private init;
}
