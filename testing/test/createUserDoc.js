
// Import the functions you need from the SDKs you need

const {app} = require('./utils.js');
const { getFunctions, httpsCallable } = require("firebase/functions");
const { getFirestore, collection, getDocs, query, where , deleteDoc, doc} = require('firebase/firestore/lite');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, signOut } = require("firebase/auth");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const functions = getFunctions(app, "europe-west3");
const db = getFirestore(app);



const createUserDoc = httpsCallable(functions, 'createUserDoc-createUserDoc');


var assert = require('assert');
const { log } = require('console');
describe('createUserDoc', function() {

  var uid = "";
  this.beforeAll(async function() {
    //Crear usuario para poder hacer las pruebas
    createUserWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    await signInWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    uid = await getAuth().currentUser.uid;
  });

  it('Se le pasan todos los parámetros.',  function() {
    createUserDoc({
      'uid': uid,
      'name' : "test",
      'email' : "email",
      'surname' : "surname",
      'phone' : "123456789",
    })
    .then( async (result) => {
      // Invoca la función asíncrona inmediatamente
  
        // Read result of the Cloud Function.
        const message = result.data.message;

         // Aquí debes pasar la referencia del documento, no el documento en sí
        assert.equal('User document created successfully', message);

        done();

    
    }).catch(async (error) => {
      assert.equal(false , true);
      done(error);
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
      .then(async (result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);
        done(result);

      }).catch(async (error) => {
        //El test pasa
        assert.equal(true , true);
        done();
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
      .then(async (result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);
        done(result);

      }).catch(async(error) => {
        //El test pasa
        assert.equal(true , true);
        done();
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
      .then(async(result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);
        done(result);

      }).catch(async(error) => {
        //El test pasa
        assert.equal(true , true);
        done();
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
      .then(async(result) => {
        // Read result of the Cloud Function.
        assert.equal(false , true);
        done(result);

      }).catch(async(error) => {
        //El test pasa
        assert.equal(true , true);
        done();
      });

    });

  
  });