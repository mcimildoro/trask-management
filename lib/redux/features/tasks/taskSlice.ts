import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { db } from "@/lib/firebase/client"
import {
  collection,
  getDocs,

} from "firebase/firestore"

interface Task {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: string
}

interface TasksState {
  tasks: Task[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  selectedTaskId: string | null
  recentlyCompletedTask: Task | null
}

const initialState: TasksState = {
  tasks: [],
  status: "idle",
  error: null,
  selectedTaskId: null,
  recentlyCompletedTask: null,
}

// Fetch tasks from API
export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const snapshot = await getDocs(collection(db, "tasks"))
  const tasks: Task[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      title: data.title,
      completed: data.completed,
      userId: data.userId,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null, // ✅ SERIALIZABLE
    }
  })
  return tasks
})

// Add a new task
export const addTask = createAsyncThunk("tasks/addTask", async (title: string, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })

    if (!response.ok) {
      throw new Error("Failed to add task")
    }

    return await response.json()
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unknown error occurred")
  }
})

// Toggle task completion
export const toggleTask = createAsyncThunk(
  "tasks/toggleTask",
  async (taskId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TasksState }
      const task = state.tasks.tasks.find((task) => task.id === taskId)

      if (!task) {
        throw new Error("Task not found")
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toggle: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      return await response.json()
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return taskId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Nuevo reducer para seleccionar una tarea
    selectTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload
    },
    // Nuevo reducer para limpiar la notificación de tarea completada
    clearRecentlyCompletedTask: (state) => {
      state.recentlyCompletedTask = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded"
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.payload as string) || "Failed to fetch tasks"
      })

      // Add task
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload)
      })

      // Toggle task completion
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload

          // Si la tarea se completó, guardarla como recientemente completada
          if (action.payload.completed) {
            state.recentlyCompletedTask = action.payload
          }

          // Deseleccionar la tarea después de completarla
          if (state.selectedTaskId === action.payload.id) {
            state.selectedTaskId = null
          }
        }
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload)
        // Si la tarea eliminada estaba seleccionada, deseleccionarla
        if (state.selectedTaskId === action.payload) {
          state.selectedTaskId = null
        }
      })
  },
})

export const { selectTask, clearRecentlyCompletedTask } = tasksSlice.actions
export default tasksSlice.reducer

