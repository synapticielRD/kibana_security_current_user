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