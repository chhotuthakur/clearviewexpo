import * as React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import MoreScreen from "./screens/MoreScreen";
import LoansScreen from "./screens/LoansScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentOptions from "./screens/PaymentOptions";
import Welcome from "./screens/Welcome";

import Education from "./screens/programs/Education";
import Car from "./screens/programs/Car";
import HomeLoan from "./screens/programs/HomeLoan";
import Business from "./screens/programs/Business";
import Professional from "./screens/programs/Professional";
import Salaried from "./screens/programs/Salaried";

import About from "./screens/more/About";
import Feedback from "./screens/more/Feedback";
import Help from "./screens/more/Help";
import Complaints from "./screens/more/Complaints";
import TermsAndConditions from "./screens/more/TermsAndConditions";
import PrivacyPolicy from "./screens/more/PrivacyPolicy";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#09e"
      inactiveColor="#555"
      labelStyle={{ fontSize: 14 }}
      style={{ backgroundColor: "#fff", fontWeight: "bold" }}
      activeIndicatorStyle={{
        height: 42,
        width: 42,
        borderRadius: 50,
        backgroundColor: "#dde",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentScreen}
        options={{
          tabBarLabel: "Payments",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "cc-amazon-pay" : "amazon-pay"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Loans"
        component={LoansScreen}
        options={{
          tabBarLabel: "Loan Programs",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="opencart" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ color }) => (
            <Ionicons name="menu-outline" size={27} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function HeaderLogo() {
  return (
    <Image
      source={require("./assets/logopng.png")}
      style={{ width: 160, height: 60 }}
      resizeMode="contain"
    />
  );
}

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="root"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#09f",
        },
      }}
    >
      <Stack.Screen
        name="root"
        component={MyTabs}
        options={{
          headerTitle: () => <HeaderLogo />,
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Complaints" component={Complaints} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="Car" component={Car} />
      <Stack.Screen name="HomeLoan" component={HomeLoan} />
      <Stack.Screen name="Business" component={Business} />
      <Stack.Screen name="Professional" component={Professional} />
      <Stack.Screen name="Salaried" component={Salaried} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
