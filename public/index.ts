import './index.scss';

import { MyPluginExamplePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new MyPluginExamplePlugin();
}
export { MyPluginExamplePluginSetup, MyPluginExamplePluginStart } from './types';
