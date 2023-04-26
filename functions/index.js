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
  const uid = "ROIUSmnpNCn0xGKdOuhu";//context.auth.uid;
  
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
    //const username = userDoc.exists ? userDoc.data.displayName : 'unknown';

    const newEntry = {
      bpm, 
      pressure, 
      o2, 
      sugar,
      //createdBy: username,
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


  