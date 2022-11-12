import express from 'express';

import {AppBinding, AppCallRequest, AppCallResponse, AppContext, AppExpandLevel} from '@mattermost/types/lib/apps';

import {AppDependencies} from './app_dependencies';

import {ShouldShowBindings, CallHandler, BaseBindable, Bindable, BindingsRegistrar, GetLabel, BindingsExpand, BindingsContext} from './myapps';
import {PagerdutyClient} from './services/pager_duty';
import {TopCommand} from './commands';
import {getExpressRouter} from '../src/express';

import manifest from './manifest/manifest';

const expressRoute = '/app';

export const getExpressApp = (deps: AppDependencies) => {
    const app = express();
    const bindingsRegistrar = new BindingsRegistrar(expressRoute, deps);
    bindingsRegistrar.addCommand(TopCommand);

    const router = getExpressRouter<AppDependencies, BindingsContext>(bindingsRegistrar, manifest, deps);

    app.use(expressRoute, router);
    return app;
}
