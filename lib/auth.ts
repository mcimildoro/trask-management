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
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store additional user data in Firestore
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        name,
        email,
      }),
    });
    
    if (!response.ok) {
      // If storing user data fails, delete the auth user
      await user.delete();
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user profile');
    }
    
    return { uid: user.uid, email: user.email };
  } catch (error: unknown) {
      if (error instanceof Error) {
        // Redundant line removed as error is already handled in the catch block
      }
      throw new Error('Registration failed');
    }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get ID token for server-side authentication
    const idToken = await user.getIdToken();
    
    // Send token to backend to set session cookie
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return { uid: user.uid, email: user.email };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Login failed');
    }
    throw new Error('Login failed');
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
