import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBlklHcWtgD0aDr0rbOy7B4LP-xADCwk_E",
  authDomain: "whatsapp-clone-d4817.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-d4817.firebaseio.com",
  projectId: "whatsapp-clone-d4817",
  storageBucket: "whatsapp-clone-d4817.appspot.com",
  messagingSenderId: "955263261321",
  appId: "1:955263261321:web:d357c73d5767a0021f0458",
  measurementId: "G-1VM9X1C03Z"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db; 