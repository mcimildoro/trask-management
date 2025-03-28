// Create Firebase admin file for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';


// Check if Firebase Admin is already initialized
const apps = getApps();

// If not initialized, initialize Firebase Admin
if (!apps.length) {
  // For Vercel, we use environment variables
  // For local development, you can use a service account key file
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // For local development, you can use a service account key file
    // Make sure to add this file to .gitignore

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require('../../firebase-service-account.json');
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

// Get Firestore instance
const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };