const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.saveMetrics = functions.https.onCall(async (data, context) => {
const bpm = data.bpm;
const pressure = data.pressure;
const o2 = data.o2;
const sugar = data.sugar;
const uid = data.uid;

 

  console.log('uid:' + uid);
  if(!uid){
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; uid ' + uid);
  }
  if(!bpm){
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; bpm ' + bpm);
  }
  if(!pressure){
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; pressure ' + pressure);
  }
  if(!o2){
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; o2 ' + o2);
  }
  if(!sugar){
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; sugar ' + sugar);
  }

  //try get 'metrics' collection, if it doesn't exist, it will be created
  //if document with uid exists, add to each array a new value of bpm, pressure, o2 and sugar respectively
  //if document with uid doesn't exist, create it and add to each array a new value of bpm, pressure, o2 and sugar respectively

  try {
    const docRef = db.collection('metrics').doc(uid);
    const metricsDoc = await docRef.get();
    const timestamp = admin.firestore.Timestamp.now();
    if (metricsDoc.exists) {
      await docRef.update({
        bpm: admin.firestore.FieldValue.arrayUnion(bpm),
        pressure: admin.firestore.FieldValue.arrayUnion(pressure),
        o2: admin.firestore.FieldValue.arrayUnion(o2),
        sugar: admin.firestore.FieldValue.arrayUnion(sugar),
        timestamp: admin.firestore.FieldValue.arrayUnion(timestamp),
      });
    } else {
      await docRef.set({
        bpm: [bpm],
        pressure: [pressure],
        o2: [o2],
        sugar: [sugar],
        timestamp: [timestamp],
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

exports.saveMetricsOneByOne = functions.https.onCall(async (data, context) => {
  const bpm = data.bpm;
  const pressure = data.pressure;
  const o2 = data.o2;
  const sugar = data.sugar;
  const userId = data.userId;
  
   
  
    console.log('userId:' + userId);
    if(!userId){
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; userId ' + userId);
    }
    if(!bpm){
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; bpm ' + bpm);
    }
    if(!pressure){
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; pressure ' + pressure);
    }
    if(!o2){
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; o2 ' + o2);
    }
    if(!sugar){
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; sugar ' + sugar);
    }
  
    //Create a doc with 6 fields: bpm, pressure, o2, sugar, timestamp and userId of user

    try {
      const docRef = db.collection('metrics2').doc();
      const metricsDoc = await docRef.get();
      const timestamp = admin.firestore.Timestamp.now();
      if (metricsDoc.exists) {
        await docRef.update({
          bpm: bpm,
          pressure: pressure,
          o2: o2,
          sugar: sugar,
          timestamp: timestamp,
          userId: userId,
        });
      } else {
        await docRef.set({
          bpm: bpm,
          pressure: pressure,
          o2: o2,
          sugar: sugar,
          timestamp: timestamp,
          userId: userId,
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

//create a new user document in the 'users' collection when a user signs up
//this function is triggered by the 'onCreate' event
exports.createUserDoc = functions.https.onCall(async (data, context) => {
    const uid = data.uid;
    const name = data.name;
    const surname = data.surname;
    const email = data.email;

    console.debug('data'+data);
    console.debug('uid'+data.uid);
    console.debug('name'+data.name);
    console.debug('surname'+data.surname);
    console.debug('email'+data.email);


    if(!uid){
        throw new functions.https.HttpsError('invalid-argument', 'Invalid data; uid ' + uid);
    }
    if(!name){
        throw new functions.https.HttpsError('invalid-argument', 'Invalid data; name ' + name);
    }
    if(!surname){
        throw new functions.https.HttpsError('invalid-argument', 'Invalid data; surname ' + surname);
    }
    if(!email){
        throw new functions.https.HttpsError('invalid-argument', 'Invalid data; email ' + email);
    }

    //try get 'users' collection, if it doesn't exist, it will be created
    //then add a document with the uid as the document id
    try {
        const docRef = db.collection('users').doc(uid);
        const userDoc = await docRef.get();
        if (!userDoc.exists) {
            await docRef.set({
                name: name,
                surname: surname,
                email: email,
                createdAt: admin.firestore.Timestamp.now(),
            });
        }
        return {
            message: 'User document created successfully',
        };
    }
    catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('internal', 'Error creating user document');
    }

    
});


  