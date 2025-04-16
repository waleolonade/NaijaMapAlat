import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect } from "react";
import { Alert, Button } from "react-native";
import { auth } from "./firebase"; // Ensure your `firebase.js` file correctly exports `auth`

// Initialize WebBrowser for authentication flows
WebBrowser.maybeCompleteAuthSession();

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNpDP8YsfM4BXp7lrzBWAbj-zorvfhQPo",
  authDomain: "naijamapalert-b024c.firebaseapp.com",
  projectId: "naijamapalert-b024c",
  storageBucket: "naijamapalert-b024c.firebasestorage.app",
  messagingSenderId: "1088631221182",
  appId: "1:1088631221182:web:6cf66372a780242456e7ef",
  measurementId: "G-67D4G7Z38R",
};

// Google OAuth Configuration
const GoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      scheme: "naijamapalert",
      path: "oauthredirect",
    }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);

      // Sign in with Firebase
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("Success", "You are now logged in!");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);

  return (
    <Button
      title="Login with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
};

export default GoogleLogin;
