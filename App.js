import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/screens/LoginScreen'; // Example screen
import SignupScreen from "./app/screens/SignupScreen"; 
import UserScreen from "./app/screens/UserScreen"; 
import HomeScreen from './app/screens/HomeScreen';
import ContactUsScreen from './app/screens/ContactScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Signup" component={SignupScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Contact" component={ContactUsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
