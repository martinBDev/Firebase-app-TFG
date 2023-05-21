
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const { admin, db } = require('../firebase');
const { checkValue } = require('./utils');


//FUNCTION 2
//create a new user document in the 'users' collection when a user signs up
//this function is triggered by the 'onCreate' event
const createUserDoc = functions.region('europe-west3').https.onCall(async (data, context) => {
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
    checkValue('user uid', context.auth.uid);

    if(uid != context.auth.uid){
        throw new functions.https.HttpsError('permission-denied', 'User uid does not match');
    }

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

exports.createUserDoc = createUserDoc;