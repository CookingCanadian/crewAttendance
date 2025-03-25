import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity } from "react-native";
import database from './firebase';
import { ref, onValue, update } from 'firebase/database'; // Add update

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
  returning: boolean;
}

const Arriving: React.FC = () => {
  const [people, setPeople] = useState<Record<string, personData>>({});

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

  const clickHere = (name: string) => {
    const personRef = ref(database, name); // Reference to the specific person
    const currentPerson = people[name];
    const newAbsent = !currentPerson.absent; // Toggle absent

    // Update Firebase
    update(personRef, { absent: newAbsent })
  };

  const clickReturning = (name: string) => {
    const personRef = ref(database, name); // Reference to the specific person
    const currentPerson = people[name];
    const newReturning = !currentPerson.returning; // Toggle returning

    // Update Firebase
    update(personRef, { returning: newReturning })
  };

  return (
    <View style={{ width: "86%", flex: 1, marginTop: 20, backgroundColor: "#ffffff", flexDirection: "column" }}>
      <StatusBar backgroundColor="#782F40" barStyle="light-content" />
      <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />
      <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: "600", margin: 12 }}>Arriving</Text>
      <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }} />

      <ScrollView style={{ flex: 1 }}>
        {Object.keys(people).length > 0 ? (
          Object.entries(people).map(([name, details], index) => (
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
              <Image
                source={{ uri: details.profilePicture }}
                style={{ width: 80, height: 80, borderRadius: 40, margin: 10 }}
              />

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
                    <Text style={{ fontFamily: "Verdana", fontSize: 12, fontWeight: "bold", color: "#828282" }}>
                      Usually Drives
                    </Text>
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
                    <Text style={{ fontFamily: "Verdana", fontSize: 12, fontWeight: "bold", color: "#828282" }}>
                      Planned Absence
                    </Text>
                  </View>
                </View>

                <View style={{ width: "100%", height: 30, flexDirection: "row", justifyContent: "space-between", paddingRight: 2 }}>
                  <TouchableOpacity
                    onPress={() => clickHere(name)} // Pass name to toggle absent
                    style={{
                      width: 90,
                      height: 26,
                      backgroundColor: details.absent ? "#a8a8a8" : "#92d696", // Red if absent, gray if here
                      borderRadius: 13,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "Verdana", fontSize: 14, fontWeight: "bold", color: "white" }}>
                      {details.absent ? "Absent" : "Here"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => clickReturning(name)} // Pass name to toggle returning
                    style={{
                      width: 90,
                      height: 26,
                      backgroundColor: details.returning ? "orange" : "#c4c4c4", // Green if returning, gray if not
                      borderRadius: 13,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "Verdana", fontSize: 14, fontWeight: "bold", color: "white" }}>
                      Returning
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontWeight: "600", fontSize: 14, marginTop: 20 }}>
              probably loading data
            </Text>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontSize: 10, marginTop: 4 }}>
              (it helps to be connected)
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Arriving;