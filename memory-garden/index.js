import { registerRootComponent } from 'expo';

import App from './App';
import Router from './router';
import HomePage1 from './component/home/base1';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Router);
