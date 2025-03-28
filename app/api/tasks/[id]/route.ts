// app/api/tasks/[id]/route.ts
import { db } from "@/lib/firebase/client"
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  const taskId = params.id;
  const ref = doc(db, "tasks", taskId)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 })
  }

  const task = snap.data()
  const updated = { completed: !task.completed }

  await updateDoc(ref, updated)
  
  // 👇 serializar el `createdAt`
  return NextResponse.json({
    id: taskId,
    title: task.title,
    completed: !task.completed,
    userId: task.userId,
    createdAt: task.createdAt?.toDate?.().toISOString?.() ?? null
  })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const taskId = params.id;
  await deleteDoc(doc(db, "tasks", taskId))
  return NextResponse.json({ message: "Deleted", id: taskId })

}