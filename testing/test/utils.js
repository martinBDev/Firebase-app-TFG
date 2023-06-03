const dotenv = require("dotenv")

dotenv.config()

const {initializeApp} = require('firebase/app');

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  exports.app = app;