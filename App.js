import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import Login from './pages/Login';
import Home from './pages/Home';
import ViewDisasters from './pages/ViewDisasters';
import DisasterDetails from './pages/DisasterDetails';
import Register from './pages/Register';
import Account from './pages/Account';
import Chatbot from './pages/Chatbot';


const Stack = createStackNavigator();
global.USERID;

function App() {
  return (
    <NavigationContainer independent={true}>
      <StatusBar hidden={true} />
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ViewDisasters" component={ViewDisasters} />
        <Stack.Screen name="DisasterDetails" component={DisasterDetails} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
