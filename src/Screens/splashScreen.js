import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
// import { Image } from "react-native/types_generated/index";


const SplashScreen = () => {
  
const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main"); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);
  return (
    <View style={styles.container}> 
    {/* <Image source={require('./assets/splash.png')} style={{ width: 200, height: 200 }} /> */}
        <Text style={styles.text}>Welcome to UserCity!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold"
  }
});
export default SplashScreen;