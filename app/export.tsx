import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useData } from './dataContext';

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
  returning: boolean;
}

const Export: React.FC = () => {
  const { people } = useData();
  const exportRef = useRef<View>(null);
  const [isReady, setIsReady] = useState(false);

  const presentPeople = Object.entries(people).filter(([_, details]) => !details.absent);
  const males = presentPeople.filter(([_, details]) => details.sex === "male");
  const females = presentPeople.filter(([_, details]) => details.sex === "female");
  const plannedAbsent = Object.entries(people).filter(([_, details]) => details.plannedAbsence && details.absent);

  const MAX_PER_COLUMN = 16;
  const maleCol1 = males.slice(0, MAX_PER_COLUMN);
  const maleCol2 = males.length > MAX_PER_COLUMN ? males.slice(MAX_PER_COLUMN) : [];
  const femaleCol1 = females.slice(0, MAX_PER_COLUMN);
  const femaleCol2 = females.length > MAX_PER_COLUMN ? females.slice(MAX_PER_COLUMN) : [];
  const plannedCol1 = plannedAbsent.slice(0, MAX_PER_COLUMN);
  const plannedCol2 = plannedAbsent.length > MAX_PER_COLUMN ? plannedAbsent.slice(MAX_PER_COLUMN) : [];

  const currentDate = new Date();
  
  const activeColumns = [
    maleCol1.length > 0,
    maleCol2.length > 0,
    femaleCol1.length > 0,
    femaleCol2.length > 0,
    plannedCol1.length > 0,
    plannedCol2.length > 0,
  ].filter(Boolean).length;
  const maxLength = Math.max(
    maleCol1.length, 
    maleCol2.length, 
    femaleCol1.length, 
    femaleCol2.length,
    plannedCol1.length,
    plannedCol2.length
  );
  const exportWidth = (activeColumns * 200) + ((activeColumns - 1) * 10) + 44; 
  const exportHeight = Math.min(1000, 110 + maxLength * 40);

  const exportAttendance = async () => {
    if (!exportRef.current || presentPeople.length === 0 || !isReady) {
      alert("View is not ready for capture.");
      return;
    }

    try {
      await Promise.all(presentPeople.map(([_, details]) => Image.prefetch(details.profilePicture)));
      await new Promise(resolve => setTimeout(resolve, 2000));
      const uri = await captureRef(exportRef, {
        format: "png",
        quality: 1.0,
        width: exportWidth,
        height: exportHeight,
        result: "tmpfile",
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
          <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: "600", marginTop: 4, marginLeft: 12 }}>
            Export
          </Text>
          <Text style={{ color: "#282b31", fontSize: 10, fontFamily: "Verdana", fontWeight: "thin", marginLeft: 12, marginBottom: 4 }}>
            {presentPeople.length === 0 ? "no entries" : `${presentPeople.length} entries`}
          </Text>
        </View>
        <TouchableOpacity style={{ width: 30, height: 30, marginRight: 12, alignItems: "center", justifyContent: "center" }} onPress={exportAttendance}>
          <Image source={require("../assets/images/icons8-send-64.png")} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }} />

      <View style={{ position: "absolute", opacity: 0, top: -1100, left: 0 }}>
        <View
          ref={exportRef}
          onLayout={() => setIsReady(true)}
          style={{ width: exportWidth, height: exportHeight, backgroundColor: "#ffffff" }}
          collapsable={false}
        >
          <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }} />
          <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: "bold", marginTop: 10, marginLeft: 10, marginBottom: 0 }}>
            Bus Arrival [{presentPeople.length}]
          </Text>

          <Text style={{ color: "#282b31", fontSize: 14, fontFamily: "Verdana", fontWeight: "light", marginLeft: 10, marginBottom: 10 }}>
            updated {currentDate.toLocaleString()}
          </Text>

          <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2", marginBottom: 10 }} />
          <View style={{ flexDirection: "row" }}>
            {maleCol1.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5 }}>
                <Text style={{ color: "#282b31", fontSize: 14, fontFamily: "Verdana", fontWeight: "600", marginBottom: 5, marginLeft: 5 }}>
                  Male [{males.length}]
                </Text>
                {maleCol1.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
            {maleCol2.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5, paddingTop: 24 }}>
                {maleCol2.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}

            { (maleCol1.length > 0 || maleCol2.length > 0) && <View style={{ width: 1, height: "100%", backgroundColor: "#cdcfd2", marginLeft: 10 }} /> }

            {femaleCol1.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5 }}>
                <Text style={{ color: "#282b31", fontSize: 14, fontFamily: "Verdana", fontWeight: "600", marginBottom: 5, marginLeft: 5 }}>
                  Female [{females.length}]
                </Text>
                {femaleCol1.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
            {femaleCol2.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5, paddingTop: 24 }}>
                {femaleCol2.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}

            { (femaleCol1.length > 0 || femaleCol2.length > 0) && <View style={{ width: 1, height: "100%", backgroundColor: "#cdcfd2", marginLeft: 10 }} /> }

            {plannedCol1.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5 }}>
                <Text style={{ color: "#282b31", fontSize: 14, fontFamily: "Verdana", fontWeight: "600", marginBottom: 5, marginLeft: 5 }}>
                  Planned Absence [{plannedAbsent.length}]
                </Text>
                {plannedCol1.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "orange" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
            {plannedCol2.length > 0 && (
              <View style={{ width: 200, backgroundColor: "#ffffff", marginHorizontal: 5, paddingTop: 24 }}>
                {plannedCol2.map(([name, details], index) => (
                  <View
                    key={index}
                    style={{ width: "100%", height: 30, marginBottom: 10, marginHorizontal: 5, backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
                    <Image source={{ uri: details.profilePicture }} style={{ width: 24, height: 24, borderRadius: 12, margin: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 5 }}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {presentPeople.length > 0 ? (
          presentPeople.map(([name, details], index) => (
            <View
              key={index}
              style={{ width: "90%", height: 40, marginBottom: 10, alignSelf: "center", backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ width: 4, height: "100%", backgroundColor: "#cdcfd2" }} />
              <Image source={{ uri: details.profilePicture }} style={{ width: 34, height: 34, borderRadius: 17, margin: 3 }} resizeMode="cover" />
              <Text style={{ fontSize: 16, fontFamily: "Verdana", fontWeight: "bold", marginLeft: 10 }}>{name}</Text>
            </View>
          ))
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center", fontFamily: "Verdana", fontWeight: "600", fontSize: 14, marginTop: 20 }}>No one is present</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Export;