import supertest from 'supertest';

import {AppBinding, AppCallRequest, AppCallResponse, AppCallResponseType} from '@mattermost/types/lib/apps';
import {UserProfile} from '@mattermost/types/lib/users';
import {AppDependencies} from 'example/app_dependencies';
import {IsAdminContext, isNotAdminResponse} from '../helpers';
import {AppCallResponseTypes} from '../constants';

export const callRequestFromSysadmin: AppCallRequest<IsAdminContext> = {
    context: {
        acting_user: {
            roles: 'system_user system_admin',
        } as UserProfile,
    },
};

export const callRequestFromEndUser: AppCallRequest<IsAdminContext> = {
    context: {
        acting_user: {
            roles: 'system_user',
        } as UserProfile,
    },
}

export const testDependencies: AppDependencies = {
    i18n: {translate: jest.fn()},
    PagerdutyClient: jest.fn(),
    Client4: jest.fn(),
};

export const findBinding = (locations: string[], bindings: AppBinding[]): AppBinding | undefined => {
    for (const b of bindings) {
        if (b.location === locations[0]) {
            if (locations.length === 1) {
                return b;
            }

            if (b.bindings) {
                return findBinding(locations.slice(1), b.bindings);
            }
        }
    }

    return undefined;
}

export const assertBindingIsVisible = async (app, commandPath: string[], req: AppCallRequest<any>): Promise<void> => {
    await supertest(app).post('/app/bindings')
        .send(req)
        .expect(200)
        .then((response) => {
            const bindings = response.body.data;
            const isPresent = findBinding(commandPath, bindings);
            expect(isPresent).toBeTruthy();
        });
}

export const assertBindingIsNotVisible = async (app, commandPath: string[], req: AppCallRequest<any>): Promise<void> => {
    await supertest(app).post('/app/bindings')
        .send(req)
        .expect(200)
        .then((response) => {
            const bindings = response.body.data;
            const isPresent = findBinding(commandPath, bindings);
            expect(isPresent).toBeFalsy();
        });
}

export const checkSysadminHandler = (app, path, shouldSucceed=false) => async () => {
    await supertest(app).post(path)
        .send(callRequestFromEndUser)
        .expect(200)
        .then((response) => {
            if (shouldSucceed) {
                expect(response.body).not.toEqual(isNotAdminResponse);
            } else {
                expect(response.body).toEqual(isNotAdminResponse);
            }
        });
};

type ErrorMessage = string;

export const checkError = (res: AppCallResponse): ErrorMessage | void => {
    if (res.type === AppCallResponseTypes.ERROR) {
        return 'Error from server: ' + res.text;
    }
}
