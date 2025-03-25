import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

interface personData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
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

  return (
    <View style={{ width: "86%", flex: 1, marginTop: 20, backgroundColor: "#ffffff", flexDirection: "column" }}>
      <View style={{ width: "100%", height: 4, backgroundColor: "#cdcfd2" }}/>
      <Text style={{ color: "#282b31", fontSize: 20, fontFamily: "Verdana", fontWeight: 600, margin: 12 }}>Arriving</Text>
      <View style={{ width: "100%", height: 1, backgroundColor: "#cdcfd2" }}/>

      <ScrollView style={{ flex: 1 }}>    
        {Object.keys(people).length > 0 ? (
          Object.entries(people).map(([name, details], index) => (
            <View key={index} style={{ width: "90%", height: 100, marginBottom: 10, alignSelf: "center", backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center" }}>
              <Image source = {{ uri: details.profilePicture}} style={{ width: 80, height: 80, borderRadius: 40, margin: 10 }}/>

              <View style={{ width: "80%", height: 100, paddingTop: 10 }}>
                <Text style={styles.name}>{name}</Text>              
                <Text>            
                  {details.bus ? 'Takes Bus' : 'Usually Drives'} |{' '}
                  {details.plannedAbsence ? 'Planned Absence' : ''} |{' '}                 
                </Text>
              </View>
              
              
              
            </View>
          ))
        ) : (
          <View style={{ flex: 1}}>
            <Text style={{alignSelf: "center", fontFamily: "Verdana", fontWeight: 600, fontSize: 14, marginTop: 20}}>probably loading data</Text>   
            <Text style={{alignSelf: "center", fontFamily: "Verdana", fontSize: 10, marginTop: 4}}>(it helps to be connected)</Text> 
          </View>
                 
        )}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  person: {
    marginVertical: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Arriving;