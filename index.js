import { registerRootComponent } from "expo";
import App from "./App";
import { LogBox } from "react-native";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Thêm dòng này ở đầu file App.js hoặc index.js
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
