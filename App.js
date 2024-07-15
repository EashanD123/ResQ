import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';
import Home from './pages/Home';
import HelpHome from './pages/HelpHome';
import HelpViewPartners from './pages/HelpViewPartners';
import Sample from './pages/Sample';
import ViewPartners from './pages/ViewPartners';
import PartnerDetails from './pages/PartnerDetails';
import AddPartners from './pages/AddPartners'
import Register from './pages/Register';
import Edit from './pages/Edit'
import email from './pages/email'
import Account from './pages/Account';
import Calendar from './pages/calendar';
import Download from './pages/download';
import Chatbot from './pages/Chatbot';


const Stack = createStackNavigator();
global.USERID;

function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HelpHome" component={HelpHome} />
      <Stack.Screen name="HelpViewPartners" component={HelpViewPartners} />
      <Stack.Screen name="ViewPartners" component={ViewPartners}/>
      <Stack.Screen name="AddPartners" component={AddPartners}/>
      <Stack.Screen name="PartnerDetails" component={PartnerDetails}/>
      <Stack.Screen name="Sample" component={Sample} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="Email" component={email}/>
      <Stack.Screen name="Edit" component={Edit}/>
      <Stack.Screen name="Calendar" component={Calendar}/>
      <Stack.Screen name="Download" component={Download}/>
      <Stack.Screen name="Chatbot" component={Chatbot}/>
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
