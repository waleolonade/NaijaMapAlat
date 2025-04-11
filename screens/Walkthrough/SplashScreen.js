// import React, { useEffect, useRef } from "react";
// import { ActivityIndicator, Animated, StatusBar, StyleSheet, View } from "react-native";

// const SplashScreen = ({ navigation }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fade in logo and tagline
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1500,
//       useNativeDriver: true,
//     }).start();

//     const timer = setTimeout(() => {
//       navigation.replace("Walkthrough");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#032B44" barStyle="light-content" />
      
//       <Animated.Image
//         source={require("../../assets/logo.png")}
//         style={[styles.logo, { opacity: fadeAnim }]}
//         resizeMode="contain"
//       />

//       <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
//         Connecting Communities with Smart Alerts
//       </Animated.Text>

//       <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#032B44",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 160,
//     height: 160,
//   },
//   tagline: {
//     marginTop: 20,
//     fontSize: 16,
//     color: "#ffffff",
//     fontWeight: "300",
//     fontStyle: "italic",
//   },
//   loader: {
//     marginTop: 30,
//   },
// });

// export default SplashScreen;


import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StatusBar, StyleSheet, View } from "react-native";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasPlayed = await AsyncStorage.getItem("hasPlayedWelcomeSound");

        if (!hasPlayed) {
          await sound.current.loadAsync(require("../../assets/sounds/welcome.mp3"));
          await sound.current.playAsync();
          await AsyncStorage.setItem("hasPlayedWelcomeSound", "true");
        }
      } catch (error) {
        console.log("Sound error:", error);
      }
    };

    checkFirstLaunch();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("Walkthrough");
    }, 3000);

    return () => {
      clearTimeout(timer);
      sound.current.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#032B44" barStyle="light-content" />
      <Animated.Image
        source={require("../../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Connecting Communities with Smart Alerts
      </Animated.Text>
      <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#032B44",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
  },
  tagline: {
    marginTop: 20,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "300",
    fontStyle: "italic",
  },
  loader: {
    marginTop: 30,
  },
});

export default SplashScreen;
