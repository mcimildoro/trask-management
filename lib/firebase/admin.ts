import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';

// Evitar doble inicialización
if (!getApps().length) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    // Producción (Vercel)
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      } as ServiceAccount),
    });
  } else {
    // Desarrollo local
    const serviceAccount = await import('../../firebase-service-account.json') as {
      default: ServiceAccount;
    };

    initializeApp({
      credential: cert(serviceAccount.default),
    });
  }
}

// Inicializar servicios
const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
