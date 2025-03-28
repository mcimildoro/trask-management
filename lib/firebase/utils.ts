//Create Firebase utility functions

import { db } from './client';
import { adminDb } from './admin';
import { FieldValue } from 'firebase-admin/firestore';

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy 
  
} from 'firebase/firestore';

// Task type definition
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: import('firebase/firestore').Timestamp | Date;
}

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// Get tasks for a user
export async function getTasks(userId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
}

// Add a new task
export async function addTask(title: string, userId: string): Promise<Task> {
  const tasksRef = collection(db, 'tasks');
  
  const newTask = {
    title,
    completed: false,
    userId,
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(tasksRef, newTask);
  
  return {
    id: docRef.id,
    ...newTask,
    createdAt: new Date() // For client-side representation
  };
}

// Toggle task completion
export async function toggleTaskCompletion(taskId: string, currentStatus: boolean): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    completed: !currentStatus
  });
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}

// Server-side functions using admin SDK
export const serverUtils = {
  // Get tasks for a user (server-side)
  async getTasks(userId: string): Promise<Task[]> {
    const tasksRef = adminDb.collection('tasks');
    const q = tasksRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');
    
    const querySnapshot = await q.get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  },
  
  // Add a new task (server-side)
  async addTask(title: string, userId: string): Promise<Task> {
    const tasksRef = adminDb.collection('tasks');
    
    const newTask = {
      title,
      completed: false,
      userId,
      createdAt: FieldValue.serverTimestamp()


    };
    
    const docRef = await tasksRef.add(newTask);
    
    return {
      id: docRef.id,
      ...newTask,
      createdAt: new Date() // For client-side representation
    };
  }
};
