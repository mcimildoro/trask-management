"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { deleteTask, toggleTask, selectTask } from "@/lib/redux/features/tasks/taskSlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, CheckCircle } from "lucide-react"

export default function TaskList() {
  const { tasks, status, error, selectedTaskId } = useAppSelector((state) => state.tasks)
  const dispatch = useAppDispatch()

  const handleToggleCompletion = (taskId: string) => {
    dispatch(toggleTask(taskId))
  }

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId))
  }

  const handleSelectTask = (taskId: string) => {
    if (selectedTaskId === taskId) {
      dispatch(selectTask(null)) // Deseleccionar si ya está seleccionada
    } else {
      dispatch(selectTask(taskId)) // Seleccionar la tarea
    }
  }

  if (status === "loading") {
    return <div className="py-4 text-center">Loading tasks...</div>
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">Error: {error}</div>
  }

  if (tasks.length === 0) {
    return <div className="py-4 text-center text-gray-500">No tasks yet. Add one above!</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-md transition-colors ${
              selectedTaskId === task.id ? "bg-blue-50 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => !task.completed && handleSelectTask(task.id)}
            style={{ cursor: task.completed ? "default" : "pointer" }}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleToggleCompletion(task.id)}
                onClick={(e) => e.stopPropagation()} // Evitar que el click en el checkbox seleccione la tarea
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </label>
            </div>
            <div className="flex items-center gap-2">
              {/* Botón de completar que aparece solo cuando la tarea está seleccionada y no está completada */}
              {selectedTaskId === task.id && !task.completed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleToggleCompletion(task.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTask(task.id)
                }}
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

