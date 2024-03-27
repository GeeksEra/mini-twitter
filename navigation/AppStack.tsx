import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../config";
import { auth } from "../config";
import { signOut } from "firebase/auth";

import { HomeScreen } from "../screens";

const Stack = createStackNavigator();

export const AppStack = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Mini Twitter",
          headerRight: () => (
            <TouchableOpacity
              style={[styles.logoutButton]} // Example usage of color from Colors object
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: Colors.white, // Example usage of color from Colors object
          },
          headerStyle: {
            backgroundColor: Colors.orange, // Example usage of color from Colors object
          },
          headerTintColor: Colors.white, // Example usage of color from Colors object
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  logoutButtonText: {
    fontWeight: "bold",
    color: Colors.white, // Example usage of color from Colors object
    fontSize: 16,
  },
});
