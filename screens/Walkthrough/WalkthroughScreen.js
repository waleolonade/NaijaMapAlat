import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const WalkthroughScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to NaijaMap Alert</Text>
      <Button title="Get Started" onPress={() => navigation.replace("Auth")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, textAlign: "center", marginBottom: 20 },
});

export default WalkthroughScreen;