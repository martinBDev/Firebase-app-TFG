
const functions = require('firebase-functions');
const { admin, db } = require('../firebase');
const { geofirestore  } = require('geofirestore');
const {
    GeoFirestoreUtils,
    } = require("geofire-common");



//FUNCTION 3
const findNearestLocation = functions.region('europe-west3').https.onCall(async (data, context) => {
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

  exports.findNearestLocation = findNearestLocation;