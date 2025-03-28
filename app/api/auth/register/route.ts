// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/firebase/client"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

export async function POST(req: Request) {
  try {
    const { uid, name, email } = await req.json()
    if (!uid || !email) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }


    await setDoc(doc(db, "users", uid), {
      uid,
      name,
      email,
      createdAt: serverTimestamp()
    })

    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error) {
    console.error("Error saving user in Firestore:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
