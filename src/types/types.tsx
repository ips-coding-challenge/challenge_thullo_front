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
  id: number | string
  name: string
  link: string
  task_id: number
  user_id: number
}

export type FileType = {
  id: string
  name: string
  progress: number
  finished: boolean
  task_id: number
}
