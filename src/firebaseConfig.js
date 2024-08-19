import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkcl0-_F-TGhPuU6X6UuCtMTYwn3t3KSc",
  authDomain: "wellapp-1f252.firebaseapp.com",
  projectId: "wellapp-1f252",
  storageBucket: "wellapp-1f252.appspot.com",
  messagingSenderId: "336410882476",
  appId: "1:336410882476:web:e75cd297791a76686f4a09",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
