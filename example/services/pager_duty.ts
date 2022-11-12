import {AppContext} from 'types/apps'

export type PagerdutyAlert = {
    message: string;
};

export interface IPagerdutyClient {
    getAlerts(): Promise<PagerdutyAlert[]>;
}

export type PagerdutyConstructable = (ctx: AppContext) => IPagerdutyClient;

export class PagerdutyClient implements IPagerdutyClient {
    constructor(private ctx: AppContext) {}

    async getAlerts(): Promise<PagerdutyAlert[]> {
        const alert: PagerdutyAlert = {
            message: 'Help!',
        };

        return [alert];
    }
}
