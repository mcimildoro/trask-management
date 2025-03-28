export interface Task {
    id: string
    title: string
    completed: boolean
    userId: string
    createdAt: string
  }
  
  export interface User {
    id: string
    name: string
    email: string
    password: string // This would be hashed in the database
  }
  
  export interface TasksState {
    tasks: Task[]
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
  }
  
