import React from "react";
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native";

interface MenuProps {
  slideAnim: Animated.Value;
  onMenuSelect: (menuItem: string) => void;
}

const Menu: React.FC<MenuProps> = ({ slideAnim, onMenuSelect }) => {
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0, // Anchor to top of screen
        left: 0, // Anchor to left of screen
        width: 250,
        height: "100%",
        backgroundColor: "#f7f7f7",
        flexDirection: "column",
        transform: [{ translateX: slideAnim }],
        zIndex: 10, // Ensure it’s above other content
      }}
    >
      <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />

      <TouchableOpacity onPress={() => onMenuSelect("arriving")}>
        <Text style={menuStyles.title}>Arriving</Text>
      </TouchableOpacity>

      <View style={menuStyles.dividerLine} />

      <TouchableOpacity onPress={() => onMenuSelect("boatLineups")}>
        <Text style={menuStyles.title}>Boat Lineups</Text>
      </TouchableOpacity>

      <View style={menuStyles.dividerLine} />

      <TouchableOpacity onPress={() => onMenuSelect("departing")}>
        <Text style={menuStyles.title}>Departing</Text>
      </TouchableOpacity>

      <View style={menuStyles.dividerLine} />
    </Animated.View>
  );
};

const menuStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: "Verdana",
    fontWeight: "600",
    color: "#4e5052",
    margin: 10,
  },
  dividerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#cdcfd2",
  },
});

export default Menu;