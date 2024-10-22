// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NewAuthProvider } from './src/context/AuthProvider';
import LoginScreen from './src/Login';
import HomeScreen from './src/Welcome';

const Stack = createStackNavigator();

export default function App() {
  return (
    
      <NavigationContainer>
        <NewAuthProvider>
          <Stack.Navigator>
            
              <Stack.Screen name="Login" component={LoginScreen}               options={{
                headerLeft: () => null,  // Esto quita el botón de retroceso
                gestureEnabled: false,  // Esto desactiva los gestos de vuelta en iOS
              }} />
              <Stack.Screen name="Welcome" options={{headerLeft: () => null, gestureEnabled: false}} component={HomeScreen} />
            
          </Stack.Navigator>
        </NewAuthProvider>
      </NavigationContainer>
    
  );
}
