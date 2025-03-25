import { Text, TouchableOpacity, View, Animated } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import Menu from "./menu";

export default function Index() {
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const menuSlide = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const menuPress = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuSlide, { 
      toValue: menuVisible ? -250 : 0, 
      duration: 300,                   
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={{ flex: 1}}>
      <View style={{ width: "100%", height: 60, backgroundColor: "#782F40", flexDirection: "row", alignItems: "center" }}> 
        <TouchableOpacity style={{ width: 32, height: 24, alignItems: "center", flexDirection: "column", justifyContent: "space-between", marginLeft: 10}} onPress={menuPress}>
          <View style={{ width: "100%", height: 4, backgroundColor: "white"}}/>
          <View style={{ width: "100%", height: 4, backgroundColor: "white"}}/>
          <View style={{ width: "100%", height: 4, backgroundColor: "white"}}/>
        </TouchableOpacity>

        <Text style={{ color: "white", fontSize: 24, fontFamily: "Verdana", fontWeight: 600, marginLeft: 10 }}>Hopkins Crew</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: "#eeeeef", justifyContent: "center", alignItems: "center" }}>
        <Menu slideAnim={menuSlide} />
      </View>
    </View>
  );
}

