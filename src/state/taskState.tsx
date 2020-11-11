import { atom } from 'recoil'
import { TaskType } from '../types/types'

export const newTaskState = atom<TaskType | null>({
  key: 'newTaskState',
  default: null,
})
