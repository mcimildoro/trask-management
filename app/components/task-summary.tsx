"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { clearRecentlyCompletedTask } from "@/lib/redux/features/tasks/taskSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Circle, ListChecks, CheckCheck } from "lucide-react"

export default function TaskSummary() {
  const { tasks, recentlyCompletedTask } = useAppSelector((state) => state.tasks)
  const dispatch = useAppDispatch()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Limpiar la notificación después de 5 segundos
  useEffect(() => {
    if (recentlyCompletedTask) {
      const timer = setTimeout(() => {
        dispatch(clearRecentlyCompletedTask())
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [recentlyCompletedTask, dispatch])

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListChecks,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: Circle,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      {/* Notificación de tarea completada */}
      {recentlyCompletedTask && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCheck className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Task &quot;{recentlyCompletedTask.title}&quot; completed successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

