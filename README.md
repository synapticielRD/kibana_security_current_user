# How to get Kibana current user

Kibana plugin

---

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.

## Scripts

<dl>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>

## How to

1. Include dependency to `security` plugin in plugin configuration file ``kibana.json`

```json
{
  "id": "myPluginExample",
  "version": "1.0.0",
  "kibanaVersion": "kibana",
  "server": true,
  "ui": true,
  "requiredPlugins": ["navigation"],
  "optionalPlugins": ["security"]
}
```

2. Pass the security plugin's setup contract through to your route handler, then you can access the current user. Something like the following should work

```ts
import { IRouter } from '../../../../src/core/server';
import { SecurityPluginSetup } from '../../../../x-pack/plugins/security/public';

interface PluginSetupDeps {
   security: SecurityPluginSetup;
}

export function defineRoutes(router: IRouter, { security }: PluginSetupDeps) {
  router.get(
    {
      path: '/api/my_plugin_example/example',
      validate: false,
    },
    async (context, request, response) => {
      let currentUser;
      if (security != null) {
        currentUser = security.authc.getCurrentUser(request);
      } 
      
      return response.ok({
        body: {
          time: new Date().toISOString(),
          user: currentUser
        },
      });
    }
  );
}
```

That will absolutely work for client-side plugins, 
For what it's worth, the client-side security plugin exposes a function to retrieve the current user, so that you don't have to rely on internal API calls which are more likely to change:

```ts
// from client side plugin, located at /path/to/kibana/plugins/myplugin/public/plugin.tsx
import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import {
  MyPluginExamplePluginSetup,
  MyPluginExamplePluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';
import { SecurityPluginSetup } from '../../../x-pack/plugins/security/public';

interface PluginSetupDeps {
   security: SecurityPluginSetup;
}

export class MyPluginExamplePlugin
  implements Plugin<MyPluginExamplePluginSetup, MyPluginExamplePluginStart> {
  public setup(core: CoreSetup, { security }: PluginSetupDeps): MyPluginExamplePluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'myPluginExample',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
      },
    });

    const { getCurrentUser } = security.authc;

    // not using `await` because the `setup` plugin lifecycle method should not be async.
   getCurrentUser().then(user => { 
     console.log(user);
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('myPluginExample.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): MyPluginExamplePluginStart {
    return {};
  }

  public stop() {}
}
```

