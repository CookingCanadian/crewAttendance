import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import database from './firebase';
import { ref, onValue } from 'firebase/database';

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
  returning: boolean;
}

const Export: React.FC = () => {
  const [people, setPeople] = useState<Record<string, personData>>({});
  const exportRef = useRef<View>(null);
  const [isReady, setIsReady] = useState(false);

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

  const presentPeople = Object.entries(people).filter(([_, details]) => !details.absent);
  const males = presentPeople.filter(([_, details]) => details.sex === "male");
  const females = presentPeople.filter(([_, details]) => details.sex === "female");
  const maxLength = Math.max(males.length, females.length);

  const exportAttendance = async () => {
    if (!exportRef.current || presentPeople.length === 0 || !isReady) {
      alert("View is not ready for capture.");
      return;
    }

    try {
      const uri = await captureRef(exportRef, {
        format: "png",
        quality: 1.0,
        width: 1000, 
        height: 70 + maxLength * 50, 
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting attendance:", error);
      alert("Failed to export attendance. Check the console for details.");
    }
  };

  return (
    <View style={{ width: "86%", flex: 1, marginTop: 20, backgroundColor: "#ffffff", flexDirection: "column" }}>
      <StatusBar backgroundColor="#782F40" barStyle="light-content" />
      <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />
      <View style={{ width: "100%", height: 50, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: "80%", height: 50 }}>
          <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: "600", marginTop: 4, marginLeft: 12 }}>Export</Text>
          <Text style={{ color: "#282b31", fontSize: 10, fontFamily: "Verdana", fontWeight: "thin", marginLeft: 12, marginBottom: 4 }}>
            {presentPeople.length === 0 ? "no entries" : `${presentPeople.length} entries`}
          </Text>
        </View>
        <TouchableOpacity style={{ width: 30, height: 30, marginRight: 12, alignItems: "center", justifyContent: "center" }} onPress={exportAttendance}>
          <Image source={require("../assets/images/icons8-send-64.png")} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }} />

      {/* Hidden Export View */}
      <View style={{ position: "absolute", opacity: 0, top: -1000, left: 0 }}>
        <View
          ref={exportRef}
          onLayout={() => setIsReady(true)}
          style={{
            width: 1000, // Width remains 1000
            height: 100 + maxLength * 50, // Adjusted height for header
            backgroundColor: "#ffffff",
          }}
          collapsable={false}
        >
          <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />
          <Text style={{ 
            color: "#282b31", 
            fontSize: 20, 
            fontFamily: "Verdana", 
            fontWeight: "bold", 
            marginTop: 10, 
            marginLeft: 20, // Adjusted for horizontal margin
            marginBottom: 10 
          }}>
            Bus Arrival [{presentPeople.length}]
          </Text>
          <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2", marginBottom: 10 }} />
          <View style={{ flexDirection: "row" }}>
            {/* Left Half: Males */}
            <View style={{ width: 500, backgroundColor: "#ffffff", marginHorizontal: 10 }}>
              <Text style={{ 
                color: "#282b31", 
                fontSize: 16, 
                fontFamily: "Verdana", 
                fontWeight: "600", 
                marginBottom: 10, 
                marginLeft: 10 
              }}>
                Male [{males.length}]
              </Text>
              {males.map(([name, details], index) => (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    height: 40,
                    marginBottom: 10,
                    marginHorizontal: 10, 
                    backgroundColor: "#f9f9f9",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                  <Image source={{ uri: details.profilePicture }} style={{ width: 34, height: 34, borderRadius: 20, margin: 3 }} />
                  <Text style={{ fontSize: 16, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 10 }}>{name}</Text>
                </View>
              ))}
            </View>
          
            <View style={{ width: 500, backgroundColor: "#ffffff", marginHorizontal: 10 }}>
              <Text style={{ 
                color: "#282b31", 
                fontSize: 16, 
                fontFamily: "Verdana", 
                fontWeight: "600", 
                marginBottom: 10, 
                marginLeft: 10 
              }}>
                Female [{females.length}]
              </Text>
              {females.map(([name, details], index) => (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    height: 40,
                    marginBottom: 10,
                    marginHorizontal: 10, 
                    backgroundColor: "#f9f9f9",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                  <Image source={{ uri: details.profilePicture }} style={{ width: 34, height: 34, borderRadius: 20, margin: 3 }} />
                  <Text style={{ fontSize: 16, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 10 }}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

   
      <ScrollView style={{ flex: 1 }}>
        {presentPeople.length > 0 ? (
          presentPeople.map(([name, details], index) => (
            <View
              key={index}
              style={{
                width: "90%",
                height: 40,
                marginBottom: 10,
                alignSelf: "center",
                backgroundColor: "#f9f9f9",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
              <Image source={{ uri: details.profilePicture }} style={{ width: 34, height: 34, borderRadius: 20, margin: 3 }} />
              <Text style={{ fontSize: 16, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 10 }}>{name}</Text>
            </View>
          ))
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontWeight: "600", fontSize: 14, marginTop: 20 }}>
              No one is present
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Export;