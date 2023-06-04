
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

const findNearCenter = httpsCallable(functions, 'findNearestLocation-findNearestLocation');
const sendEmail = httpsCallable(functions, 'sendEmail-sendEmail');
const saveMetris = httpsCallable(functions, 'saveMetrics');




var assert = require('assert');
const { log } = require('console');
describe('findNearestCenter', function() {

  var uid = "";
  this.beforeAll(async function() {
    //Crear usuario para poder hacer las pruebas
    createUserWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    await signInWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    uid = await getAuth().currentUser.uid;
  });

  //There is already a center for testing purposes:  40.71427, -74.00597

    it('Se le pasan todos los parámetros y existe centro cercano', function(done) {

        findNearCenter({
            'latitude' : 40.71427,
            'longitude' : -74.00597,
        }).then(async (result) => {

               // Invoca la función asíncrona inmediatamente
                const name = result.data.name;
    
                assert.equal('Test Center', name);
                //Done without parameters means that the test has passed
                done();


        }).catch((error) => {
            assert.equal(false, true);
            done(error);
        });
     
    });



    
    it('Se le pasan todos los parámetros pero no hay centro cercano', async function() {

        findNearCenter({
            'latitude' : 35.71427,
            'longitude' : -74.00597,
        }).then((result) => {
            
               // Invoca la función asíncrona inmediatamente
                const name = result.data.name;
          
            
                assert.equal(undefined, name);
                done();

        }).catch((error) => {
            assert.equal(false, true);
            done(error);
        });
     
    


    });




    it('No se pasa alguna coordenada', async function() {

        findNearCenter({
            'longitude' : -74.00597,
        }).then((result) => {
       
               // Invoca la función asíncrona inmediatamente
               assert.equal(false, true);
                done(result);


        }).catch((error) => {
            //Se espera excepcion
            assert.equal(true, true);
            done();
        });
     
    


    });


    it('No se inicia sesion', async function() {

        signOut(getAuth());
        findNearCenter({
            'latitude' : 40.71427,
            'longitude' : -74.00597,
        }).then((result) => {
         
               // Invoca la función asíncrona inmediatamente
               assert.equal(false, true);
                done(result);
   

        }).catch((error) => {
            //Se espera excepcion
            assert.equal(true, true);
            done();
        });
     
    


    });

});
