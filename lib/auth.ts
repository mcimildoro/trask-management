// This file contains the authentication logic for the application.
"use client";

import { auth } from './firebase/client';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { useState, useEffect } from 'react';


// Register a new user
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Enviar datos al backend para guardarlos en Firestore
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        name,
        email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ Error al guardar en Firestore:", errorData)

      // Si falla guardar en Firestore, elimina el usuario de Auth
      await user.delete()
      throw new Error(errorData.message || "Error al crear perfil de usuario")
    }


    return { uid: user.uid, email: user.email }
  } catch (error) {
    console.error("❌ Error en registro:", error)
    throw new Error("El registro ha fallado")
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    return { uid: user.uid, email: user.email };
  } catch (error: unknown) {
    console.error("❌ Login error:", error);
    throw new Error("Login failed");
  }
}



// Logout user
export async function logoutUser() {
  try {
    await firebaseSignOut(auth);
    
    // Clear server-side session
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Hook to get current user
export function useUser() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return { user, loading };
}
