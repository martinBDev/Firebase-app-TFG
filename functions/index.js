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
  const { bpm, pressure, o2, sugar } = data;
  const uid = context.auth.uid;
  
  if (
    typeof bpm !== 'number' || 
    typeof pressure !== 'number' || 
    typeof o2 !== 'number' || 
    typeof sugar !== 'number') {
    throw new functions.https.HttpsError('invalid-argument', 'Three arguments must be numbers');
  }

  try {
    const docRef = db.collection('users').doc(uid);
    const userDoc = await docRef.get();
    const username = userDoc.exists ? userDoc.data().displayName : 'unknown';

    const newEntry = {
      bpm, 
      pressure, 
      o2, 
      sugar,
      createdBy: username,
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('numbers').add(newEntry);

    return {
      message: 'Números guardados correctamente',
    };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Ha ocurrido un error al guardar los números');
  }
});
