const functions = require("firebase-functions");

const { admin, db } = require('./firebase');
const {
  geohashForLocation,
} = require("geofire-common");

const saveMetrics = require('./individuals/saveMetrics');
const findNearestLocation = require('./individuals/findNearestLocation');
const sendEmail = require('./individuals/sendEmail');
const createUserDoc = require('./individuals/createUserDoc');

exports.saveMetrics = saveMetrics;
exports.findNearestLocation = findNearestLocation;
exports.sendEmail = sendEmail;
exports.createUserDoc = createUserDoc;


//FUNCTION 4
exports.createGeoHash = functions.firestore
  .document('centers/{centerId}')
  .onCreate((snap, context) => {
    
    //Add field to documento
    const location = change.after.data().pos.geopoint;
    const hash = geohashForLocation([location.latitude, location.longitude]);

      
      return snap.ref.set({
        pos: {
          geohash: hash,
          geopoint: location
        }
      }, {merge: true});
  });

//FUNCTION 5
exports.updateGeoHash = functions.firestore
  .document('centers/{centerId}')
  .onUpdate((change, context) => {
    
    const location = change.after.data().pos.geopoint;
    
    const hash = geohashForLocation([location.latitude, location.longitude]);


    //Add field to document
    return change.after.ref.set({
      pos: {
        geohash: hash,
        geopoint: location
      }
    }, {merge: true});

  });


