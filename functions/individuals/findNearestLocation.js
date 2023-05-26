
const functions = require('firebase-functions');
const { admin, db } = require('../firebase');

const geo = require('geofirex').init(admin);


//FUNCTION 3
const findNearestLocation = functions.region('europe-west3').https.onCall(async (data, context) => {
    const currentLatitude = data.latitude;
    const currentLongitude = data.longitude;
    
    //Check all values are not null or undefined
    checkValue('latitude', currentLatitude);
    checkValue('longitude', currentLongitude);
  
    currentGeoPoint = geo.point(currentLatitude, currentLongitude);
    const centersCollection = db.collection('centers');
  
    const kilometersRadius = 10; //10km
    var foundResults = false;

    //Concentric searches until a center is found
    while(!foundResults){ 
      
      const centerQuery = geo.query(centersCollection).within(currentGeoPoint, kilometersRadius, 'pos');
      const centerQueryResults = await centerQuery.get();
      if(centerQueryResults.docs.length > 0){
        foundResults = true;
        //Sorted from nearest to farthest
        return centerQueryResults.docs[0].data();
      }
      kilometersRadius += 10;

    }

    return null;

   
  });

  exports.findNearestLocation = findNearestLocation;