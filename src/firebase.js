import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCS2cwD_ITS1tSidswJ1SdslJJXtW5b1tU",
  authDomain: "audiogen-2d8dd.firebaseapp.com",
  projectId: "audiogen-2d8dd",
  storageBucket: "audiogen-2d8dd.appspot.com",
  messagingSenderId: "1038672336408",
  appId: "1:1038672336408:web:b84ebed12b25c86cf5556d",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = getAuth(app);

export { auth, storage };
