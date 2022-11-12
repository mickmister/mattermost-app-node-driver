import {AppCallRequest, AppCallResponse, AppManifest} from '@mattermost/types/lib/apps';
import express from 'express';
import {Bindable, BindingsRegistrar} from './apps_driver';

export const getExpressRouter = <D, BindingsContext>(bindingsRegistrar: BindingsRegistrar<D, BindingsContext>, manifest: AppManifest, deps: D) => {
    const router = express.Router();
    router.use(express.json());

    const bindables = bindingsRegistrar.getBindables();

    for (const bindable of bindables) {
        const {endpoint, handler} = bindable;
        if (endpoint && handler) {
            router.post<string, any, AppCallResponse, AppCallRequest<any>>(endpoint, async (req, res) => {
                try {
                    const callResponse = await handler(req.body, deps);
                    res.json(callResponse);
                } catch (e) {
                    res.json({
                        type: 'error',
                        text: 'Error happened while handling request: ' + e,
                    });
                }
            });
        }
    }

    router.post('/bindings', async (req, res) => {
        const bindingsResponse = await bindingsRegistrar.handleBindings(req.body, deps);
        res.json(bindingsResponse);
    });

    router.get('/manifest.json', (req, res) => {
        res.json(manifest);
    });

    return router;
}
