import { atom, selectorFamily } from 'recoil'
import { TaskType } from '../types/types'
import { listState } from './listState'

export const newTaskState = atom<TaskType | null>({
  key: 'newTaskState',
  default: null,
})

// export const listTasksState = selectorFamily<TaskType[] | undefined, number>({
//   key: 'listTasks',
//   get: (id) => ({ get }) => {
//     const list = get(listState).find((l) => l.id === id)
//     return list?.tasks
//   },
//   se
// })
