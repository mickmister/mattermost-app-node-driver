import {AppBinding, AppCallRequest, AppCallResponse, AppContext, AppExpandLevel} from 'types/apps';

import {ShouldShowBindings, CallHandler, BaseBindable, Bindable, BindingsRegistrar, GetLabel, BindingsExpand, BindingsContext, MakeBinding} from './myapps';
import {isAdmin, isNotAdminResponse} from './helpers';
import {handleConfigure, ConfigureOAuthContext, ConfigureOAuthExpand} from './handlers/configure';

@BaseBindable.makeBindable()
export class TopCommand extends BaseBindable {
    location = 'node-example';
}

@TopCommand.add()
export class FunCommand extends BaseBindable {
    location = 'fun';

    handler: CallHandler = (req, deps) => ({
        type: 'ok',
        text: 'nice work!',
    });
}

@TopCommand.add()
export class ConfigureCommand extends BaseBindable {
    location = 'configure';
    shouldShow = isAdmin;
}

@ConfigureCommand.add()
export class ConfigureOAuthCommand extends BaseBindable implements Bindable {
    location = 'oauth';

    expand = ConfigureOAuthExpand;
    handler: CallHandler<ConfigureOAuthContext> = handleConfigure;
}
