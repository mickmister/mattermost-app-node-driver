import {AppCallRequest, AppCallResponse} from 'types/apps';
import {UserProfile} from '@mattermost/types/lib/users';
import {AppDependencies} from './app_dependencies';
import {BaseHandler} from './myapps';

export const isNotAdminResponse: AppCallResponse = {
    type: 'error',
    text: 'Not admin',
};

export type IsAdminContext = {
    acting_user: UserProfile,
}

export const isAdmin: BaseHandler<boolean, IsAdminContext> = (req, deps) => {
    const user = req.context.acting_user;
    if (!user) {
        return false;
    }

    return user.roles.split(' ').includes('system_admin');
}
