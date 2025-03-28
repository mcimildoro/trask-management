"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchTasks } from "@/lib/redux/features/tasks/taskSlice"
import TaskList from "@/app/components/task-list"
import TaskForm from "@/app/components/task-form"
import TaskSummary from "@/app/components/task-summary"
import { logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks)
  console.log(tasks)
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  async function handleLogout() {
    await logoutUser()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <Image
              src="/user.png" 
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700">Cerrar sesión</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">Task Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <TaskForm />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <TaskList />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <TaskSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
