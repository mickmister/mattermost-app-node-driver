import {UserProfile} from '@mattermost/types/lib/users';
import {isAdmin, isNotAdminResponse} from '../helpers';
import {CallHandler} from '../myapps';

export const ConfigureOAuthExpand = {
    acting_user: 'all',
    bot_access_token: 'all',
};

export type ConfigureOAuthContext = {
    acting_user: UserProfile;
    bot_access_token: string;
};

export const handleConfigure: CallHandler<ConfigureOAuthContext> = async (req, deps) => {
    if (!isAdmin(req, deps)) {
        return isNotAdminResponse;
    }

    const client = deps.Client4(req.context.mattermost_site_url!, req.context.bot_access_token);
    const users = client.getUser('');

    const pg = deps.PagerdutyClient(req.context);
    const alerts = await pg.getAlerts();

    const message = alerts.map(a => a.message).join('\n');

    req.context.acting_user;

    req.context.acting_user_id;

    return {
        type: 'ok',
        text: message,
    };
}
