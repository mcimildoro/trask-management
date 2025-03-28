// Create login route - using Firebase session cookie

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Verify the Firebase ID token
    await adminAuth.verifyIdToken(idToken);
    
    // Create a session cookie
    // Firebase session cookies can last up to 2 weeks
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000, // Convert to seconds
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}


