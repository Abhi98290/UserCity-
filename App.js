import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from "./src/Screens/splashScreen";
import HomeScreen from "./src/Screens/HomeScreen";
import ServicesScreen from "./src/Screens/ServicesScreen";
import ActivityScreen from "./src/Screens/ActivityScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import RideBookingScreen from "./src/Screens/RideBookingScreen";
import ServiceBookingScreen from "./src/Screens/ServiceBookingScreen";
import LocationPickerScreen from "./src/Screens/LocationPickerScreen";
import RideTrackingScreen from "./src/Screens/RideTrackingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name={focused ? "home" : "home-outline"} 
              size={focused ? 26 : 24} 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
                textShadowColor: focused ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name={focused ? "grid" : "grid-outline"} 
              size={focused ? 26 : 24} 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
                textShadowColor: focused ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name={focused ? "receipt" : "receipt-outline"} 
              size={focused ? 26 : 24} 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
                textShadowColor: focused ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Icon 
              name={focused ? "person" : "person-outline"} 
              size={focused ? 26 : 24} 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
                textShadowColor: focused ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RideBooking" 
          component={RideBookingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ServiceBooking" 
          component={ServiceBookingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LocationPicker" 
          component={LocationPickerScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RideTracking" 
          component={RideTrackingScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
