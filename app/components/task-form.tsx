"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addTask } from "@/lib/redux/features/tasks/taskSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"

export default function TaskForm() {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setIsSubmitting(true)

    try {
      await dispatch(addTask(title)).unwrap()
      setTitle("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
    </div>
  )
}

