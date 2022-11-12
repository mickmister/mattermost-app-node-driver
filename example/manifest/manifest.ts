import {AppManifest} from '@mattermost/types/apps';

let manifest: AppManifest = {
    app_id: 'node-driver-example',
    display_name: 'Node Driver Example',
    homepage_url: 'https://google.com',
    deploy: {
        http: {
            root_url: 'http://localhost:1337/app',
        },
    },

} as AppManifest;

manifest = {
    "app_id": "node-driver-example",
    "version": "v1.0.0",
    "homepage_url": "https://google.com",
    "display_name": "Node Driver Example",
    "description": "",
    "bindings": {
       "path": "/bindings",
       "expand": {
          "acting_user": "all",
          "oauth2_app": "all",
          "oauth2_user": "all",
          "locale": "all"
       }
    },
    "requested_permissions": [
       "act_as_bot",
       "act_as_user",
       "remote_webhooks",
       "remote_oauth2"
    ],
    "requested_locations": [
       "/command",
       "/channel_header",
       "/post_menu"
    ],
    "http": {
       "root_url": "http://localhost:1337/app"
    },
    "remote_webhook_auth_type": "none",
    "on_remote_webhook": {
       "path": "/webhook",
       "expand": {
          "oauth2_app": "all"
       }
    }
} as any;

export default manifest;
