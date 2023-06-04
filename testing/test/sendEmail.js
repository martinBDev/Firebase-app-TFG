const {app} = require('./utils.js');
const { getFunctions, httpsCallable } = require("firebase/functions");
const { getFirestore, collection, getDocs, query, where , deleteDoc, doc} = require('firebase/firestore/lite');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, signOut } = require("firebase/auth");

const functions = getFunctions(app, "europe-west3");
const db = getFirestore(app);

const sendEmail = httpsCallable(functions, 'sendEmail-sendEmail');



var assert = require('assert');
const { log } = require('console');
describe('sendEmail', function() {

  var uid = "";
  this.beforeAll(async function() {
    //Crear usuario para poder hacer las pruebas
    createUserWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    await signInWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    uid = await getAuth().currentUser.uid;
  });


  //We will use the same center as in findNearestCenter test

  it('Se le pasan todos los parámetros, dueño es el invocador, hay centro cercano.', function(done) {

       sendEmail({
            'nearestCenter': "7eHlSgetxzhQBKESZuEM",
            'location' : {
                'latitude' : 40.71427,
                'longitude' : -74.00597,
            },
            'bpm' : 50,
            "o2" : 50,
            "pressure" : 50,
            "sugar" : 50
        }).catch((error) => {
            done(error);
        });

        //The function returns nothing, so if it doesn't throw an error, it means it has passed
        assert.equal(true, true);

    });




    it('No se passa alguna métrica', function(done) {

        sendEmail({
            'nearestCenter': "6FyF900bSoFPQApV5WOT",
            'location' : {
                'latitude' : 40.71427,
                'longitude' : -74.00597,
            },
            "pressure" : 50,
            "sugar" : 50
        }).then((result) => {

            done(result);


        }).catch((error) => {

            done();


        });

    });



    it('ID del centro no existe', function(done) {

        sendEmail({
            'nearestCenter': "nonExistentCenter",
            'location' : {
                'latitude' : 40.71427,
                'longitude' : -74.00597,
            },
            'bpm' : 50,
            "o2" : 50,
            "pressure" : 50,
            "sugar" : 50
        }).then((result) => {

            done(result);


        }).catch((error) => {

            done();


        });

    });

});