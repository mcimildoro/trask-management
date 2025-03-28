import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {   serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { uid, name, email } = await request.json();
    
    // Store user data in Firestore
    await adminDb.collection('users').doc(uid).set({
      name,
      email,
      createdAt: serverTimestamp(),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to create user profile" },
      { status: 500 }
    );
  }
}