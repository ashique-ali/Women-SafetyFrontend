import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneVerificationScreen from './Pages/PhoneVerificationScreen';
import VerificationScreen from './Pages/VerifictionScreen';
import HomePageScreen from './Pages/HomePageScreen';
import ProfilePage from './Pages/ProfilePage';
import LocationScreen from './Pages/LocationScreen';
const Stack = createNativeStackNavigator();
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import InviteTrack from './Pages/InviteTrack';
import Congractulation from './Pages/CongractulationScreen';
import CongractulationScreen from './Pages/CongractulationScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
          name="HomePage"
          component={HomePageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="track"
          component={InviteTrack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Congractulation"
          component={CongractulationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#555',
  },
});
