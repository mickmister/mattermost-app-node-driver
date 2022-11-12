import {UserProfile} from '@mattermost/types/lib/users';

export declare enum Permission {
    UserJoinedChannelNotification = "user_joined_channel_notification",
    ActAsBot = "act_as_bot",
    ActAsUser = "act_as_user",
    PermissionActAsAdmin = "act_as_admin",
    RemoteOAuth2 = "remote_oauth2",
    RemoteWebhooks = "remote_webhooks"
}
export declare enum Locations {
    PostMenu = "/post_menu",
    ChannelHeader = "/channel_header",
    Command = "/command",
    InPost = "/in_post"
}
export declare type AppManifest = {
    app_id: string;
    version?: string;
    homepage_url?: string;
    icon?: string;
    display_name: string;
    description?: string;
    requested_permissions?: Permission[];
    requested_locations?: Locations[];
};
export declare type AppModalState = {
    form: AppForm;
    call: AppCallRequest<AppContext>;
};
export declare type AppCommandFormMap = {
    [location: string]: AppForm;
};
export declare type BindingsInfo = {
    bindings: AppBinding[];
    forms: AppCommandFormMap;
};
export declare type AppsState = {
    main: BindingsInfo;
    rhs: BindingsInfo;
    pluginEnabled: boolean;
};
export declare type AppBinding = {
    app_id: string;
    location?: string;
    icon?: string;
    label: string;
    hint?: string;
    description?: string;
    role_id?: string;
    depends_on_team?: boolean;
    depends_on_channel?: boolean;
    depends_on_user?: boolean;
    depends_on_post?: boolean;
    bindings?: AppBinding[];
    form?: AppForm;
    submit?: AppCall;
};
export declare type AppCallValues = {
    [name: string]: any;
};
export declare type AppCall<Expand=AppExpand> = {
    path: string;
    expand?: Expand & AppExpand;
    state?: any;
};
export declare type AppCallRequest<Context> = {
    context: Context & AppContext;
    values?: AppCallValues;
    raw_command?: string;
    selected_field?: string;
    query?: string;
};
export declare type AppCallResponseType = string;
export declare type AppCallResponse<Res = unknown> = {
    type: AppCallResponseType;
    text?: string;
    data?: Res;
    navigate_to_url?: string;
    use_external_browser?: boolean;
    call?: AppCall;
    form?: AppForm;
    app_metadata?: AppMetadataForClient;
};
export declare type AppMetadataForClient = {
    bot_user_id: string;
    bot_username: string;
};
export declare type AppContext = {
    app_id?: string;
    mattermost_site_url?: string;
    location?: string;
    acting_user_id?: string;
    acting_user?: UserProfile;
    user_id?: string;
    channel_id?: string;
    team_id?: string;
    post_id?: string;
    root_id?: string;
    props?: AppContextProps;
    user_agent?: string;
    track_as_submit?: boolean;
};
export declare type AppContextProps = {
    [name: string]: string;
};
export declare type AppExpandLevel = string;
export declare type AppExpand = {
    app?: AppExpandLevel;
    acting_user?: AppExpandLevel;
    channel?: AppExpandLevel;
    config?: AppExpandLevel;
    mentioned?: AppExpandLevel;
    parent_post?: AppExpandLevel;
    post?: AppExpandLevel;
    root_post?: AppExpandLevel;
    team?: AppExpandLevel;
    user?: AppExpandLevel;
};
export declare type AppForm = {
    title?: string;
    header?: string;
    footer?: string;
    icon?: string;
    submit_buttons?: string;
    cancel_button?: boolean;
    submit_on_cancel?: boolean;
    fields?: AppField[];
    source?: AppCall;
    submit?: AppCall;
    depends_on?: string[];
};
export declare type AppFormValue = string | AppSelectOption | boolean | null;
export declare type AppFormValues = {
    [name: string]: AppFormValue;
};
export declare type AppSelectOption = {
    label: string;
    value: string;
    icon_data?: string;
};
export declare type AppFieldType = string;
export declare type AppField = {
    name: string;
    type: AppFieldType;
    is_required?: boolean;
    readonly?: boolean;
    value?: AppFormValue;
    description?: string;
    label?: string;
    hint?: string;
    position?: number;
    modal_label?: string;
    refresh?: boolean;
    options?: AppSelectOption[];
    multiselect?: boolean;
    lookup?: AppCall;
    subtype?: string;
    min_length?: number;
    max_length?: number;
};
export declare type AutocompleteSuggestion = {
    suggestion: string;
    complete?: string;
    description?: string;
    hint?: string;
    iconData?: string;
};
export declare type AutocompleteSuggestionWithComplete = AutocompleteSuggestion & {
    complete: string;
};
export declare type AutocompleteElement = AppField;
export declare type AutocompleteStaticSelect = AutocompleteElement & {
    options: AppSelectOption[];
};
export declare type AutocompleteDynamicSelect = AutocompleteElement;
export declare type AutocompleteUserSelect = AutocompleteElement;
export declare type AutocompleteChannelSelect = AutocompleteElement;
export declare type FormResponseData = {
    errors?: {
        [field: string]: string;
    };
};
export declare type AppLookupResponse = {
    items: AppSelectOption[];
};
