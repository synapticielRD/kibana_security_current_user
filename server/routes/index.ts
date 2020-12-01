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
