import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface MyPluginExamplePluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MyPluginExamplePluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
