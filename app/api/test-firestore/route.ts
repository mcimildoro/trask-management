import { NextResponse } from "next/server"
import { db } from "@/lib/firebase/client"
import { collection, addDoc } from "firebase/firestore"

export async function GET() {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Hello Firebase from server",
      timestamp: new Date()
    })

    return NextResponse.json({ id: docRef.id }, { status: 200 })
  } catch (error) {
    console.error("Error writing to Firestore:", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
