const functions = require("firebase-functions");
const { admin, db } = require('../firebase');
const { checkValue } = require('./utils');

//FUNTION 1
//Save metrics in 'metrics' collection
//This function is called when Android app sends metrics
//This function saves: bpm, pressure, o2, sugar, timestamp and ownerUID of user
const saveMetrics = functions.region('europe-west3').https.onCall(async (data, context) => {
    const bpm = data.bpm;
    const pressure = data.pressure;
    const o2 = data.o2;
    const sugar = data.sugar;
    const ownerUID = data.ownerUID;
    const location = data.location;
    
   
    //Check all values are not null or undefined
    checkValue('ownerUID', ownerUID);
    checkValue('user uid', context.auth.uid);

    if(ownerUID != context.auth.uid){
        throw new functions.https.HttpsError('permission-denied', 'User uid does not match');
    }

    checkValue('bpm', bpm);

    checkValue('pressure', pressure);
    checkValue('o2', o2);
    checkValue('sugar', sugar);
    checkValue('location', location);

    //Create a doc with 6 fields: bpm, pressure, o2, sugar, timestamp and ownerUID of user

    try {
      const docRef = db.collection('metrics').doc();
      const metricsDoc = await docRef.get();
      const timestamp = admin.firestore.Timestamp.now();
      if (metricsDoc.exists) {
        await docRef.update({
          bpm: bpm,
          pressure: pressure,
          o2: o2,
          sugar: sugar,
          timestamp: timestamp,
          location: location,
          ownerUID: ownerUID,
        });
      } else {
        await docRef.set({
          bpm: bpm,
          pressure: pressure,
          o2: o2,
          sugar: sugar,
          timestamp: timestamp,
          location: location,
          ownerUID: ownerUID,
        });
      }
      return {
        message: 'Metrics saved successfully',
      };
    }catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('internal', 'Error saving metrics');
    }
    
  
  });


  module.exports = saveMetrics;