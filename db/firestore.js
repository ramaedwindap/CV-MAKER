const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');


// Replace with your Firebase credentials
let serviceAccount
if (process.env.NODE_ENV == 'production') {
    serviceAccount = {
        type: process.env.FIRESTORE_type,
        project_id: process.env.FIRESTORE_project_id,
        private_key_id: process.env.FIRESTORE_private_key_id,
        private_key: process.env.FIRESTORE_private_key,
        client_email: process.env.FIRESTORE_client_email,
        client_id: process.env.FIRESTORE_client_id,
        auth_uri: process.env.FIRESTORE_auth_uri,
        token_uri: process.env.FIRESTORE_token_uri,
        auth_provider_x509_cert_url: process.env.FIRESTORE_auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.FIRESTORE_client_x509_cert_url,
        universe_domain: process.env.FIRESTORE_universe_domain,
    }
} else { serviceAccount = require('./serviceAccountKey.json'); }

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db, FieldValue };