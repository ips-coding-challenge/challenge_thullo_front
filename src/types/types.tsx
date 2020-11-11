export type User = {
  id: number
  username: string
  email: string
  avatar?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type Board = {
  id: number
  name: string
  cover: string
  user_id: number
  username: string
  members: User[]
  created_at?: string | null
  updated_at?: string | null
}

export type ListOfTasks = {
  id: number
  name: string
  board_id: number
  created_at?: string | null
  updated_at?: string | null
}

export type TaskType = {
  id?: number | null
  title: string
  board_id: number
  list_id: number
  position: number
  cover?: string
  created_at?: string | null
  updated_at?: string | null
}
