import React from 'react'
import { Component } from 'react/cjs/react.production.min';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/pages/Home.js';
import SignatureScreen from './src/pages/Signature.js'

const Stack = createNativeStackNavigator();
export default class App extends Component {
  render() {
    return (
      <NavigationContainer initialRouteName="Home">
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Signature' component={SignatureScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
