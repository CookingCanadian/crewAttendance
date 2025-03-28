// dataContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import database from './firebase';
import { ref, onValue, update, Unsubscribe } from 'firebase/database';

interface PersonData {
  absent: boolean;
  bus: boolean;
  plannedAbsence: boolean;
  profilePicture: string;
  sex: string;
  returning: boolean;
  boarded?: boolean;
}

interface DataContextType {
  people: Record<string, PersonData>;
  updatePerson: (name: string, updates: Partial<PersonData>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Define the DataProvider component
const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Record<string, PersonData>>({});

  useEffect(() => {
    const dbRef = ref(database);
    const unsubscribe: Unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setPeople(data || {});
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const updatePerson = (name: string, updates: Partial<PersonData>) => {
    const personRef = ref(database, name);
    update(personRef, updates).catch((error) => {
      console.error(`Error updating ${name}:`, error);
    });
  };

  return (
    <DataContext.Provider value={{ people, updatePerson }}>
      {children}
    </DataContext.Provider>
  );
};

// Export DataProvider as the default export
export default DataProvider;

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};