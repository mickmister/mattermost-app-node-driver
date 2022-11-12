import supertest from 'supertest';

import {AppDependencies} from '../app_dependencies';
import {getExpressApp} from '../express_app';
import {callRequestFromEndUser, callRequestFromSysadmin, checkSysadminHandler, checkError, testDependencies} from './test_utils';
import {isNotAdminResponse} from '../helpers';
import {IPagerdutyClient, PagerdutyAlert} from '../services/pager_duty';
import {AppCallResponse, AppContext} from '@mattermost/types/lib/apps';
import {UserProfile} from '@mattermost/types/lib/users';

class MockPagerDutyClient implements IPagerdutyClient {
    constructor(private ctx: AppContext) { }
    getAlerts = jest.fn();
}

const CreateClient4Mock = (mmMock: any) => {
    return jest.fn().mockReturnValue(mmMock);
}

describe('handlers', () => {
    describe('configure/oauth', () => {
        let deps, app;
        beforeEach(() => {
            deps = testDependencies;
            app = getExpressApp(deps);
        });

        const path = '/app/commands/configure/oauth';

        it('should return an error if user is not sysadmin', () => {
            checkSysadminHandler(app, path);
        });

        it('allow me to configure oauth', async () => {
            const pgMock = {
                getAlerts: jest.fn().mockResolvedValue([{
                    message: 'Test Alert Message',
                }]),
            };

            const mmMock = {
                getUser: jest.fn().mockResolvedValue({id: 'some id'} as UserProfile),
            };

            const newDeps: AppDependencies = {
                ...deps,
                PagerdutyClient: jest.fn().mockReturnValue(pgMock),
                Client4: jest.fn().mockReturnValue(mmMock),
            };
            const newApp = getExpressApp(newDeps);

            const req = callRequestFromSysadmin;

            await supertest(newApp).post('/app/commands/configure/oauth')
                .send(req)
                .expect(200)
                .then((response) => {
                    const resp = response.body as AppCallResponse;

                    expect(checkError(resp)).toBeUndefined();

                    expect(resp).not.toEqual(isNotAdminResponse);
                    expect(mmMock.getUser).toHaveBeenCalled();
                    expect(pgMock.getAlerts).toHaveBeenCalled();

                    expect(resp.text).toEqual('Test Alert Message');
                });
        });
    });
});
