import React, { useState, createContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the type for the user object
interface User {
  // Define the properties of your user object
}

// Define the type for the context value
interface AuthenticatedUserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create the context
export const AuthenticatedUserContext = createContext<AuthenticatedUserContextType>({
  user: null,
  setUser: () => null,
});

// Define the props for the provider
interface AuthenticatedUserProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthenticatedUserProvider: React.FC<AuthenticatedUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};