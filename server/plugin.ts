import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';


import { MyPluginExamplePluginSetup, MyPluginExamplePluginStart } from './types';
import { defineRoutes } from './routes';
import { SecurityPluginSetup } from '../../../x-pack/plugins/security/public';

interface PluginSetupDeps {
   security: SecurityPluginSetup;
}

export class MyPluginExamplePlugin
  implements Plugin<MyPluginExamplePluginSetup, MyPluginExamplePluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, { security }: PluginSetupDeps) {
    this.logger.debug('my_plugin_example: Setup');
    const router = core.http.createRouter();   
    // Register server side APIs
    defineRoutes(router, { security });

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('my_plugin_example: Started');
    return {};
  }

  public stop() {}
}
