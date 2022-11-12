import supertest from 'supertest';

import {handleConfigure} from '../handlers/configure';

import {ConfigureCommand, ConfigureOAuthCommand} from '../commands';
import {BindingsRegistrar} from '../myapps';
import {assertBindingIsNotVisible, assertBindingIsVisible, callRequestFromEndUser, callRequestFromSysadmin, findBinding, testDependencies} from './test_utils';
import {getExpressApp} from '../express_app';

describe('commands', () => {
    const deps = testDependencies;
    const bindingsRegistrar = new BindingsRegistrar('/app', deps);
    const app = getExpressApp(deps);

    describe('configure', () => {
        it('should show for sysadmin', async () => {
            const req = callRequestFromSysadmin;
            const commandPath = ['/command', 'node-example', 'configure'];
            await assertBindingIsVisible(app, commandPath, req);
        });

        it('should not show for other users', async () => {
            const req = callRequestFromEndUser;
            const commandPath = ['/command', 'node-example', 'configure'];
            await assertBindingIsNotVisible(app, commandPath, req);
        });
    });

    describe('configure/oauth', () => {
        it('should show for sysadmin', async () => {
            const req = callRequestFromSysadmin;
            const commandPath = ['/command', 'node-example', 'configure', 'oauth'];
            await assertBindingIsVisible(app, commandPath, req);
        });

        it('should not show for other users', async () => {
            const req = callRequestFromEndUser;
            const commandPath = ['/command', 'node-example', 'configure', 'oauth'];
            await assertBindingIsNotVisible(app, commandPath, req);
        });
    });
});
