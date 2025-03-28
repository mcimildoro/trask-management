// app/api/tasks/[id]/route.ts
import { db } from "@/lib/firebase/client"
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const taskId = params?.id;
  if (!taskId) {
    return NextResponse.json({ message: "Missing task ID" }, { status: 400 });
  }

  const ref = doc(db, "tasks", taskId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const task = snap.data();
  const updated = { completed: !task.completed };

  await updateDoc(ref, updated);

  return NextResponse.json({
    id: taskId,
    title: task.title,
    completed: !task.completed,
    userId: task.userId,
    createdAt: task.createdAt?.toDate?.().toISOString?.() ?? null,
  });
}


// ✅ Funciona y evita el error de Next.js
// ✅ Solución sin warnings de Next.js
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const taskId = params.id;

  try {
    await deleteDoc(doc(db, "tasks", taskId));
    return NextResponse.json({ message: "Deleted", id: taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Failed to delete task", error },
      { status: 500 }
    );
  }
}





