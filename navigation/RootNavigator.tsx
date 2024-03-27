import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { AuthenticatedUserContext } from "../providers";
import { LoadingIndicator } from "../components";
import { auth } from "../config";

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext); // Destructure user and setUser from context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        try {
          if (authenticatedUser) {
            setUser(authenticatedUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error setting authenticated user:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error observing authentication state:", error);
        setIsLoading(false);
      }
    );

    // Unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [setUser]); // Add setUser to the dependency array

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
