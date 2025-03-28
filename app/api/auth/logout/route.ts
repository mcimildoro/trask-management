import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the token cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  
  return NextResponse.json({ success: true });
}