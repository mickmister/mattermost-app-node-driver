import {Client4} from '@mattermost/client';
import {AppContext} from '@mattermost/types/lib/apps';
import {AppDependencies} from './app_dependencies';
import {getExpressApp} from './express_app';
import {PagerdutyClient} from './services/pager_duty';

const deps: AppDependencies = {
    i18n: {
        translate: (name: string) => name,
    },
    PagerdutyClient: (ctx: AppContext) => new PagerdutyClient(ctx),
    Client4: (url: string, token: string) => {
        const client = new Client4();
        client.setUrl(url);
        client.setToken(token);
        return client;
    },
};

const app = getExpressApp(deps);

const port = process.env.PORT || '1337';
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
