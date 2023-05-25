//Function to check a value is not null or undefined,
//if it is throw an error
//Export the function
const functions = require('firebase-functions');
exports.checkValue = function checkValue(name,value) {
    if (!value) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid data; ' + name + ":" + value);
    }
  }

