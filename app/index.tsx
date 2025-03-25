import { Text, TouchableOpacity, View, Animated, StatusBar } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import Menu from "./menu";
import Arriving from "./arriving";
import Export from "./export";

export default function Index() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("arriving");
  const menuSlide = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const menuPress = () => {
    const toValue = menuVisible ? -250 : 0;
    setMenuVisible(!menuVisible);
    Animated.timing(menuSlide, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMenuSelect = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
    setMenuVisible(false);
    Animated.timing(menuSlide, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "arriving":
        return <Arriving />;
      case "boatLineups":
        return <Text>Boat Lineups Content</Text>;
      case "departing":
        return <Text>Departing Content</Text>;
      case "export":
        return <Export />
      default:
        return <Text>Select an option from the menu.</Text>;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#782F40" barStyle="light-content" />
      <View
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "#782F40",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: 32,
            height: 24,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: 10,
          }}
          onPress={menuPress}
        >
          <View style={{ width: "100%", height: 4, backgroundColor: "white" }} />
          <View style={{ width: "100%", height: 4, backgroundColor: "white" }} />
          <View style={{ width: "100%", height: 4, backgroundColor: "white" }} />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontFamily: "Verdana",
            fontWeight: "600",
            marginLeft: 10,
          }}
        >
          Hopkins Crew
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#eeeeef",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", 
        }}
      >
        {renderContent()}
        <Menu slideAnim={menuSlide} onMenuSelect={handleMenuSelect} />
      </View>
    </View>
  );
}