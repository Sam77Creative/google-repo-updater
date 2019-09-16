import { IAppConfig } from "../interfaces";
export declare class App {
    private config;
    private pubSub;
    constructor(config: IAppConfig);
    private startApp;
    private subscribeToPubSub;
    private isCorrectRepository;
    private isCorrectBranch;
    private executeScript;
    private createSessionID;
    private init;
}
