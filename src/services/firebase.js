// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase (usando configuração de desenvolvimento)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "bombrider-demo.firebaseapp.com",
  databaseURL: "https://bombrider-demo-default-rtdb.firebaseio.com",
  projectId: "bombrider-demo",
  storageBucket: "bombrider-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (para dados persistentes como NFTs)
export const db = getFirestore(app);

// Inicializar Realtime Database (para multiplayer em tempo real)
export const realtimeDb = getDatabase(app);

export default app;

