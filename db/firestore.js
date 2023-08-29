const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');


// Replace with your Firebase credentials
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db, FieldValue };