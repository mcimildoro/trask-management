// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ message: "Missing token" }, { status: 400 });

    await adminAuth.verifyIdToken(idToken);

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return NextResponse.json({ message: "Session created" });
  } catch (error) {
    console.error("❌ Login failed:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 401 });
  }
}
