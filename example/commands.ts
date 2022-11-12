import {AppBinding, AppCallRequest, AppCallResponse, AppContext, AppExpandLevel} from 'types/apps';

import {ShouldShowBindings, CallHandler, BaseBindable, Bindable, BindingsRegistrar, GetLabel, BindingsExpand, BindingsContext, MakeBinding} from './myapps';
import {isAdmin, isNotAdminResponse} from './helpers';
import {handleConfigure, ConfigureOAuthContext, ConfigureOAuthExpand} from './handlers/configure';

const command = BaseBindable.addBinding;

export class TopCommand extends BaseBindable {
    location = 'node-example';
}

@command(TopCommand)
export class FunCommand extends BaseBindable {
    location = 'fun';
    endpoint = '/commands/fun';

    handler: CallHandler = (req, deps) => ({
        type: 'ok',
        text: 'nice work!',
    });
}

@command(TopCommand)
export class ConfigureCommand extends BaseBindable {
    location = 'configure';
    shouldShow = isAdmin;
}

@command(ConfigureCommand)
export class ConfigureOAuthCommand extends BaseBindable implements Bindable {
    location = 'oauth';

    endpoint = '/commands/configure/oauth';
    expand = ConfigureOAuthExpand;
    handler: CallHandler<ConfigureOAuthContext> = handleConfigure;
}
