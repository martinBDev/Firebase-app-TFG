
// Import the functions you need from the SDKs you need

const {app} = require('./utils.js');
const { getFunctions, httpsCallable } = require("firebase/functions");
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, signOut } = require("firebase/auth");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const functions = getFunctions(app, "europe-west3");
const db = getFirestore(app);



const createUserDoc = httpsCallable(functions, 'createUserDoc-createUserDoc');
const findNearCenter = httpsCallable(functions, 'findNearestLocation-findNearestLocation');
const sendEmail = httpsCallable(functions, 'sendEmail-sendEmail');
const saveMetris = httpsCallable(functions, 'saveMetrics');

var assert = require('assert');
describe('createUserDoc', function() {

  var uid = "";
  this.beforeAll(async function() {
    //Crear usuario para poder hacer las pruebas
    createUserWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    await signInWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    uid = await getAuth().currentUser.uid;
  });

    it('Se le pasan todos los parámetros.', async function() {
      
      
     
      createUserDoc({
        'uid': uid,
        'name' : "test",
        'email' : "email",
        'surname' : "surname",
        'phone' : "123456789",
      })
      .then((result) => {
        // Read result of the Cloud Function.
        const message = result.data.message;
       
        print(message);
        assert.equal('User document created successfully', message);

       

        //delete created user document
        db.collection('users').doc(uid).delete();
        
         

      }).catch((error) => {
        print(error);
        assert.equal(false , true);
      });

      
    });

    it('Se le pasa UID vacio', async function() {

      createUserDoc({
        'uid': '',
        'name' : "test",
        'email' : "email",
        'surname' : "surname",
        'phone' : "123456789",
      })
      .then((result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);

      }).catch((error) => {
        //El test pasa
        assert.equal(true , true);
      });



    });

    it('Se le pasa nombre vacio', async function() {

      createUserDoc({
        'uid': uid,
        'name' : "",
        'email' : "email",
        'surname' : "surname",
        'phone' : "123456789",
      })
      .then((result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);

      }).catch((error) => {
        //El test pasa
        assert.equal(true , true);
      });

    });

    it('Se le pasa email vacio', async function() {

      createUserDoc({
        'uid': uid,
        'name' : "test",
        'email' : "",
        'surname' : "surname",
        'phone' : "123456789",
      })
      .then((result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);

      }).catch((error) => {
        //El test pasa
        assert.equal(true , true);
      });


    });

    it('Se le pasa telefono vacio', async function() {

      createUserDoc({
        'uid': uid,
        'name' : "test",
        'email' : "test",
        'surname' : "surname",
        'phone' : "",
      })
      .then((result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);

      }).catch((error) => {
        //El test pasa
        assert.equal(true , true);
      });

    });

  
  });