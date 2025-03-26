import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity, Animated, Modal } from "react-native";
import database from './firebase';
import { ref, onValue, update } from 'firebase/database';

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
  returning: boolean;
  boarded?: boolean; // Optional boarded boolean
}

const Departing: React.FC = () => {
  const [people, setPeople] = useState<Record<string, personData>>({});
  const spinValue = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const dbRef = ref(database);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setPeople(data || {});
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => unsubscribe();
  }, []);

  const clickBoarded = (name: string) => {
    const personRef = ref(database, name);
    const currentPerson = people[name];
    const newBoarded = !currentPerson.boarded; // Toggle the boarded state
    update(personRef, { boarded: newBoarded });
  };

  const handleRefresh = () => {
    setModalVisible(true);
  };

  const confirmRefresh = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const updates: Record<string, boolean> = {};
    Object.keys(people).forEach((name) => {
      updates[`${name}/boarded`] = false; // Reset all boarded to false
    });
    update(ref(database), updates);
    setModalVisible(false);
  };

  const cancelRefresh = () => {
    setModalVisible(false);
  };

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const returningPeople = Object.entries(people).filter(([_, details]) => details.returning);

  return (
    <View style={{ width: "86%", flex: 1, marginTop: 20, backgroundColor: "#ffffff", flexDirection: "column" }}>
      <StatusBar backgroundColor="#782F40" barStyle="light-content" />
      <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />
      <View style={{ width: "100%", height: 50, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: "600" }}>Departing</Text>
          <Text style={{ color: "#282b31", fontSize: 10, fontFamily: "Verdana", fontWeight: "thin", marginTop: 2 }}>
            {returningPeople.length === 0 ? "no entries" : `${returningPeople.length} entries`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={{ width: 30, height: 30 }}>
          <Animated.Image source={require("../assets/images/icons8-refresh-60.png")} style={{ width: 30, height: 30, transform: [{ rotate: spin }] }} />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }} />

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 300, height: 4, backgroundColor: "#cdcfd2" }} />
          <View style={{ width: 300, padding: 20, backgroundColor: "#ffffff", alignItems: "center", elevation: 5 }}>
            <Text style={{ fontFamily: "Verdana", fontSize: 18, fontWeight: "600", color: "#282b31", marginBottom: 15 }}>( ͠° ͟ʖ ͡°)</Text>
            <Text style={{ fontFamily: "Verdana", fontSize: 14, color: "#828282", textAlign: "center", marginBottom: 20 }}>
              Are you sure you want to reset boarding? This will mark all people as not boarded.
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <TouchableOpacity onPress={cancelRefresh} style={{ width: 120, padding: 10, backgroundColor: "#c4c4c4", borderRadius: 8, alignItems: "center" }}>
                <Text style={{ fontFamily: "Verdana", fontSize: 14, fontWeight: "bold", color: "#ffffff" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRefresh} style={{ width: 120, padding: 10, backgroundColor: "#782F40", borderRadius: 8, alignItems: "center" }}>
                <Text style={{ fontFamily: "Verdana", fontSize: 14, fontWeight: "bold", color: "#ffffff" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1 }}>
        {Object.keys(people).length > 0 ? (
          returningPeople.map(([name, details], index) => (
            <View
              key={index}
              style={{
                width: "90%",
                height: 100,
                marginBottom: 10,
                alignSelf: "center",
                backgroundColor: "#f9f9f9",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image source={{ uri: details.profilePicture }} style={{ width: 80, height: 80, borderRadius: 40, margin: 10 }} />

              <View style={{ width: "65%", height: 100, paddingTop: 10, justifyContent: "space-between" }}>
                <Text style={{ fontSize: 16, fontFamily: "Verdana", fontWeight: "bold" }}>{name}</Text>

                <View style={{ width: "100%", height: 30 }}>
                  <View
                    style={{
                      width: "100%",
                      height: details.bus ? 0 : 15,
                      flexDirection: "row",
                      overflow: "hidden",
                      alignItems: "center",
                      justifyContent: details.plannedAbsence ? "space-between" : "flex-start",
                    }}
                  >
                    <View style={{ width: 12, height: 12, borderRadius: 7, backgroundColor: "#92d696", marginRight: 4 }} />
                    <Text style={{ fontFamily: "Verdana", fontSize: 12, fontWeight: "bold", color: "#828282" }}>Usually Drives</Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      height: details.plannedAbsence ? 15 : 0,
                      flexDirection: "row",
                      overflow: "hidden",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: 12, height: 12, borderRadius: 7, backgroundColor: "orange", marginRight: 4 }} />
                    <Text style={{ fontFamily: "Verdana", fontSize: 12, fontWeight: "bold", color: "#828282" }}>Planned Absence</Text>
                  </View>
                </View>

                <View style={{ width: "100%", height: 30, flexDirection: "row", justifyContent: "flex-end", paddingRight: 2 }}>
                  <TouchableOpacity
                    onPress={() => clickBoarded(name)}
                    style={{
                      width: 90,
                      height: 26,
                      backgroundColor: details.boarded ? "#92d696" : "#c4c4c4",
                      borderRadius: 13,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "Verdana", fontSize: 14, fontWeight: "bold", color: "white" }}>
                      {details.boarded ? "Boarded" : "Missing"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontWeight: "600", fontSize: 14, marginTop: 20 }}>probably loading data</Text>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontSize: 10, marginTop: 4 }}>(it helps to be connected)</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Departing;