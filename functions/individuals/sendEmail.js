const functions = require('firebase-functions');
const { admin, db } = require('../firebase');

//FUNCTION 6
exports.sendEmail = functions.region('europe-west3').https.onCall(async (data, context) => {

    const userUID = context.auth.uid;
    const bpm = data.bpm;
    const pressure = data.pressure;
    const o2 = data.o2;
    const sugar = data.sugar;
    const location = data.location;
    const nearestCenter = data.nearestCenter;
  
    //Check all values are not null or undefined
    checkValue('user uid', userUID);
    checkValue('bpm', bpm);
    checkValue('pressure', pressure);
    checkValue('o2', o2);
    checkValue('sugar', sugar);
    checkValue('location', location);
    checkValue('nearestCenter', nearestCenter);
  
  
    //get user document
    const userDoc = await db.collection('centers').doc(nearestCenter).get();
    const nearestCenterEmail = userDoc.data().email;
  
    //Send email
    admin
    .firestore()
    .collection("mail")
    .add({
      to: "nearestCenterEmail",
      message: {
        subject: "Hello from Firebase!",
        text: "This is the plaintext section of the email body.",
        html: "This is the <code>HTML</code> section of the email body.",
      },
    })
    .then(() => console.log("Queued email for delivery!"))
    .catch(error => console.error(error));
  
  });
  