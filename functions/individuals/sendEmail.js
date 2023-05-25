const functions = require('firebase-functions');
const { admin, db } = require('../firebase');
const { checkValue } = require('./utils');
//FUNCTION 6
exports.sendEmail = functions.region('europe-west3').https.onCall(async (data, context) => {

    const userUID = context.auth.uid;
    const bpm = data.bpm;
    const pressure = data.pressure;
    const o2 = data.o2;
    const sugar = data.sugar;
    const location = data.location;
    const nearestCenter = data.nearestCenter;

    console.log(data);
  
    //Check all values are not null or undefined
    checkValue('user uid', userUID);
    checkValue('bpm', bpm);
    checkValue('pressure', pressure);
    checkValue('o2', o2);
    checkValue('sugar', sugar);
    checkValue('location', location);
    checkValue('nearestCenter', nearestCenter);
  
  
    //get user document
    const centerDoc = await db.collection('centers').doc("pJZ1KDkQHJmEE52w05FU").get();
    const nearestCenterEmail = centerDoc.data().email;

    const userDoc = await db.collection('users').doc(userUID).get();
    const userName = userDoc.data().name + " " + userDoc.data().surname;
    const userPhone = userDoc.data().phone;

  
    const emailDoc = await db.collection('emailTemplates').doc("alertEmail").get();
    emailLayout = ""+emailDoc.data().html;


    //substitude text in email layout
    emailLayout = emailLayout.replace("{{nombre_usuario}}", userName);
    emailLayout = emailLayout.replace("{{numero_telefono}}", userPhone);
    //Current timestamp
    var date = new Date();
    emailLayout = emailLayout.replace("{{timestamp_medicion}}", date.toLocaleString());
    emailLayout = emailLayout.replace("{{id_usuario}}", userUID);
    emailLayout = emailLayout.replace("{{bpm}}", bpm);
    emailLayout = emailLayout.replace("{{pressure}}", pressure);
    emailLayout = emailLayout.replace("{{o2level}}", o2);
    emailLayout = emailLayout.replace("{{sugar}}", sugar);
    emailLayout = emailLayout.replace("{{long}}", location.longitude);
    emailLayout = emailLayout.replace("{{lat}}", location.latitude);

    //Send email
    admin
    .firestore()
    .collection("mail")
    .add({
      to: nearestCenterEmail,
      message: {
        subject: '⚠️ Alerta para usuario ' + userUID + ' ⚠️',
        html: emailLayout,
      },
    })
    .then(() => console.log("Queued email for delivery!"))
    .catch(error => console.error(error));
  
  });
  