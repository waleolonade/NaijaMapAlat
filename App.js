import React from "react";
import 'react-native-get-random-values';
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return <AppNavigator />;
}

// In your AuthContext.js
export const AuthProvider = ({ children }) => {
  console.log('AuthProvider mounting'); // Add this line
  // ... rest of your code
};
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native'; 


// import React from "react";
// import AppNavigator from "./navigation/AppNavigator";

// export default function App() {
//   return <AppNavigator />;
// }
