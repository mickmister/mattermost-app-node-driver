import {AppCallResponse, AppContext} from 'types/apps';
import {UserProfile} from '@mattermost/types/lib/users';
import * as apps from '../src/apps_driver';

import {AppDependencies} from './app_dependencies';

export type BindingsContext = {
    acting_user: UserProfile;
};

export type BindingsExpand = {
    acting_user: 'all';
};

export type RequiredDependencies = {
    logger: {};
};

export type MakeBinding = apps.MakeBinding<AppDependencies, BindingsContext>;

export type BaseHandler<ReturnValue, Context=AppContext> = apps.BaseHandler<ReturnValue, AppDependencies, Context>;

export type ShouldShowBindings = apps.ShouldShowBindings<AppDependencies, BindingsContext>;
export type CallHandler<Context=AppContext, Response=unknown> = apps.CallHandler<AppDependencies, Context, AppCallResponse<Response>>;
export type GetLabel = apps.GetLabel<AppDependencies, BindingsContext>;

export abstract class BaseBindable extends apps.BaseBindable<AppDependencies, BindingsContext> {}
export type Bindable = apps.Bindable<AppDependencies>;

export class BindingsRegistrar extends apps.BindingsRegistrar<AppDependencies, BindingsContext> {}

function validate<D>(x: any) {
    const y = (() => {}) as any;
    return y;
}
