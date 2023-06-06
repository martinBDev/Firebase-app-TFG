
const {app} = require('./utils.js');
const { getFunctions, httpsCallable } = require("firebase/functions");
const { getFirestore, collection, getDocs, query, where , deleteDoc, doc} = require('firebase/firestore/lite');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, signOut } = require("firebase/auth");

const functions = getFunctions(app, "europe-west3");
const db = getFirestore(app);


const saveMetrics = httpsCallable(functions, 'saveMetrics');


var assert = require('assert');
const { log } = require('console');
describe('saveMetrics', function() {

  var uid = "";
  this.beforeAll(async function() {
    //Crear usuario para poder hacer las pruebas
    createUserWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    await signInWithEmailAndPassword(getAuth(), "testing@email.com", "password");
    uid = await getAuth().currentUser.uid;
  });



  
  it('Se le pasan todos los parámetros, dueño es el invocador.', function() {

    saveMetrics({
        'bpm' : 50,
        "o2" : 50,
        "pressure" : 50,
        "sugar" : 50,
        "ownerUID" : uid,
        'location' : {
            'latitude' : 40.71427,
            'longitude' : -74.00597,
        }
    }).then((result) => {
        
           // Invoca la función asíncrona inmediatamente
            const message = result.data.message;

            assert.equal('Metrics saved successfully', message);
            //Done without parameters means that the test has passed
            done();
        

    }).catch((error) => {
        assert.equal(false, true);
        done(error);
    });
 
});




  
it('No se pasa alguna métrica.', function(done) {

    saveMetrics({
        "sugar" : 50,
        "ownerUID" : uid,
        'location' : {
            'latitude' : 40.71427,
            'longitude' : -74.00597,
        }
    }).then((result) => {
      
        
        done(result);


    }).catch((error) => {
        done();
    });
 
});




it('UID de invocador diferente al pasado por parámetro', function(done) {

    saveMetrics({
        'bpm' : 50,
        "o2" : 50,
        "pressure" : 50,
        "sugar" : 50,
        "ownerUID" : "otherUID",
        'location' : {
            'latitude' : 40.71427,
            'longitude' : -74.00597,
        }
    }).then((result) => {
        
            assert.equal(false, true);
            done(result);
    

    }).catch((error) => {
        assert.equal(true, true);
        //Done without parameters means that the test has passed
        done();
    });
 
});


});