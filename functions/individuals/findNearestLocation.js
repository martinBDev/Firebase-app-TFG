
const functions = require('firebase-functions');
const { admin, db } = require('../firebase');
const { checkValue } = require('./utils');
const geo = require('geofirex').init(admin);
const { get } = require('geofirex');


//FUNCTION 3
const findNearestLocation = functions.region('europe-west3').https.onCall(async (data, context) => {
    const currentLatitude = data.latitude;
    const currentLongitude = data.longitude;
    
    //Check all values are not null or undefined
    checkValue('latitude', currentLatitude);
    checkValue('longitude', currentLongitude);
  
    currentGeoPoint = geo.point(currentLatitude, currentLongitude);
    const centersCollection = db.collection('centers');
  
    var kilometersRadius = 200; //200km


    const centerQuery = geo.query(centersCollection).within(currentGeoPoint, kilometersRadius, 'pos');
    const centerQueryResults = await get(centerQuery);
    console.log(centerQueryResults)
    if(centerQueryResults.length > 0){
      
      //Sorted from nearest to farthest
      console.info("FOUND");
      console.log(centerQueryResults)
      return centerQueryResults[0];
    }
    kilometersRadius += 10;

    

    return null;

   
  });

  exports.findNearestLocation = findNearestLocation;