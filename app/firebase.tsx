import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA-Dh9GV_rHULpJPDw4A82jf55QwoCdm_4",
  authDomain: "crewattendance-85077.firebaseapp.com",
  databaseURL: "https://crewattendance-85077-default-rtdb.firebaseio.com",
  projectId: "crewattendance-85077",
  storageBucket: "crewattendance-85077.firebasestorage.app",
  messagingSenderId: "965379153165",
  appId: "1:965379153165:web:ac216476da5dbef2b62444",
  measurementId: "G-E0ZQFSHEGG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };