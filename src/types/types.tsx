export type User = {
  id: number
  username: string
  email: string
  avatar?: string | null
  role?: 'user' | 'admin'
  created_at?: string | null
  updated_at?: string | null
}

export type Board = {
  id: number
  name: string
  cover: string
  user_id: number
  username: string
  avatar?: string
  description?: string
  members: User[]
  visibility: string
  created_at?: string | null
  updated_at?: string | null
}

export type ListOfTasks = {
  id: number
  name: string
  board_id: number
  tasks: TaskType[]
  created_at?: string | null
  updated_at?: string | null
}

export type TaskType = {
  id?: number | null
  title: string
  description: string | null
  board_id: number
  list_id: number
  position: number
  labels: LabelType[]
  cover?: string
  assignedMembers?: User[]
  attachments?: AttachmentType[]
  comments?: CommentType[]
  created_at?: string | null
  updated_at?: string | null
}

export type InvitationType = {
  id: number
  token: string
  board_id: number
  user_id: number
  owner_name: string
  board_cover: string
  board_name: string
}

export type LabelType = {
  id: number
  name: string
  color: string
  board_id: number
}

export type AttachmentType = {
  id: number
  name: string
  url: string
  public_id: string
  format?: string | null
  task_id: number
  user_id?: number
  created_at: string
}

export type CommentType = {
  id: number
  content: string
  task_id: number
  user_id?: number
  username?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export type FileType = {
  id: string
  name: string
  progress: number
  finished: boolean
  task_id: number
}

export type UploadError = {
  task_id: number
  message: string
  filename: string
}
