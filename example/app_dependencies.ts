import {Client4} from '@mattermost/client';
import {PagerdutyConstructable} from './services/pager_duty';

export type Client4Constructrable = (url: string, token: string) => Client4;

export type AppDependencies = {
    PagerdutyClient: PagerdutyConstructable;
    Client4: Client4Constructrable;

    i18n: {translate: (name: string) => string}
}
