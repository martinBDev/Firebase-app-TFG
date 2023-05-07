const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { geofirestore  } = require('geofirestore');
const {
  geohashForLocation,
} = require("geofire-common");

admin.initializeApp();

const db = admin.firestore();


//Save metrics in 'metrics' collection
//This function is called when Android app sends metrics
//This function saves: bpm, pressure, o2, sugar, timestamp and ownerUID of user
exports.saveMetrics = functions.region('europe-west3').https.onCall(async (data, context) => {
    const bpm = data.bpm;
    const pressure = data.pressure;
    const o2 = data.o2;
    const sugar = data.sugar;
    const ownerUID = data.ownerUID;
    const location = data.location;
    
   
    //Check all values are not null or undefined
    checkValue('ownerUID', ownerUID);
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

//create a new user document in the 'users' collection when a user signs up
//this function is triggered by the 'onCreate' event
exports.createUserDoc = functions.region('europe-west3').https.onCall(async (data, context) => {
    const uid = data.uid;
    const name = data.name;
    const surname = data.surname;
    const email = data.email;
    const phone = data.phone;

    console.debug('data:'+data);
    console.debug('uid:'+data.uid);
    console.debug('name:'+data.name);
    console.debug('surname:'+data.surname);
    console.debug('email:'+data.email);
    console.debug('phone:'+data.phone);

    //check all values are not null or undefined
    checkValue('uid', uid);
    checkValue('name', name);
    checkValue('surname', surname);
    checkValue('email', email);
    checkValue('phone', phone);

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
                phone: phone,
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



exports.findNearestLocation = functions.region('europe-west3').https.onCall(async (data, context) => {
  const currentLatitude = data.latitude;
  const currentLongitude = data.longitude;
  
  //Check all values are not null or undefined
  checkValue('latitude', currentLatitude);
  checkValue('longitude', currentLongitude);

  currentGeoPoint = new admin.firestore.GeoPoint(currentLatitude, currentLongitude);

  const geocollection = geofirestore .collection('centers');

  //Read docs from 'centers' collection
  try {

    const snapshot = await geocollection.get();
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
    }));

    let nearestLocation = null;
    let nearestDistance = Number.MAX_VALUE;
 
    locations.forEach(location => {
      const distance = GeoFirestoreUtils.distanceBetween(
        [location.data.coordinates.latitude, location.data.coordinates.longitude],
        [center.latitude, center.longitude]
      );
  
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestLocation = location;
      }
    });

    //Return the nearest center
    return {
      center: nearestLocation,
    };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Error searching nearest center');
  }
 
});

//Function to check a value is not null or undefined,
//if it is throw an error
function checkValue(name,value) {
  if (!value) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid data; ' + name + ":" + value);
  }
}

exports.createGeoHash = functions.firestore
  .document('centers/{centerId}')
  .onCreate((snap, context) => {
    
    //Add field to documento
    const location = snap.data().location;
    const hash = geohashForLocation([location.latitude, location.longitude]);

      
      return snap.ref.set({
        geohash: hash
      }, {merge: true});
  });

  exports.updateGeoHash = functions.firestore
  .document('centers/{centerId}')
  .onUpdate((change, context) => {
    
    const location = change.after.data().location;
    
    const hash = geohashForLocation([location.latitude, location.longitude]);


    //Add field to document
    return change.after.ref.set({
      geohash: hash
    }, {merge: true});

  });

  