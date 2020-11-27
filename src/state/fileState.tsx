import { atom, atomFamily, selectorFamily } from 'recoil'
import { FileType } from '../types/types'

// {task_id, status}
export const filesState = atom<FileType[]>({
  key: 'filesState',
  default: [],
})

export const filesStateForTask = selectorFamily<FileType[], number>({
  key: 'filesStateForTask',
  get: (taskId) => ({ get }) => {
    return get(filesState).filter((f: FileType) => f.task_id === taskId)
  },
})

// Get only the static param from the file
export const fileState = selectorFamily<
  { id: string; name: string } | undefined,
  string
>({
  key: 'fileState',
  get: (fileId) => ({ get }) => {
    const file = get(filesState).find((f: FileType) => f.id === fileId)

    if (file) {
      return {
        id: file.id,
        name: file.name,
      }
    }
    return file
  },
})

export const fileProgressState = selectorFamily<FileType | undefined, string>({
  key: 'fileProgressState',
  get: (fileId) => ({ get }) => {
    return get(filesState).find((f: FileType) => f.id === fileId)
  },
})
