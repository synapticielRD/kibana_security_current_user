import { PluginInitializerContext } from '../../../src/core/server';
import { MyPluginExamplePlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new MyPluginExamplePlugin(initializerContext);
}

export { MyPluginExamplePluginSetup, MyPluginExamplePluginStart } from './types';
