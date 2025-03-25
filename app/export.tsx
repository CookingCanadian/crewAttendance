import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from "react-native";
import database from './firebase';
import { ref, onValue } from 'firebase/database';

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
}

const Export: React.FC = () => {
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

  return (
    <View style={{ width: "86%", flex: 1, marginTop: 20, backgroundColor: "#ffffff", flexDirection: "column" }}>
        <StatusBar backgroundColor="#782F40" barStyle="light-content" />
        <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }}/>
        <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: 600, margin: 12 }}>Export</Text>
        <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }}/>
        
    </View>
  );
};


export default Export;