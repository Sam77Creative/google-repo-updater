export interface IAppConfig {
    projectId: string;
    topic: string;
    keyFile: string;
    repository: string;
    branch: string;
    shellScript: string;
}
export interface IPubSubNotification {
    name: string;
    url: string;
    eventTime: string;
    refUpdateEvent: {
        email: string;
        refUpdates: {
            [branchName: string]: {
                refName: string;
                updateType: string;
                oldId: string;
                newId: string;
            };
        };
    };
}
