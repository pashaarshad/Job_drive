// Firebase Configuration - Updated with your actual config
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcZKNY52xo0YVhhTrT2NyGGozE4Rsiq5I",
    authDomain: "job-drive-10358.firebaseapp.com",
    projectId: "job-drive-10358",
    storageBucket: "job-drive-10358.firebasestorage.app",
    messagingSenderId: "771346415784",
    appId: "1:771346415784:web:2a1e4820053a998f13c29d",
    measurementId: "G-2M9V0KBSHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Force account selection and optimize for popup
provider.setCustomParameters({
    prompt: 'select_account',
    display: 'popup'  // Force popup mode
});

// Set persistence to LOCAL (persists even after browser is closed)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('Auth persistence set to LOCAL');
    })
    .catch((error) => {
        console.error('Error setting auth persistence:', error);
    });

export { auth, db, provider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc, updateDoc };
