import { atom, atomFamily, selectorFamily } from 'recoil'
import { TaskType, User } from '../types/types'

export const tasksState = atom<TaskType[]>({
  key: 'tasksState',
  default: [],
})

export const newTaskState = atom<TaskType | null>({
  key: 'newTaskState',
  default: null,
})

export const currentTaskState = selectorFamily<TaskType | undefined, number>({
  key: 'currentTaskState',
  get: (id: number) => ({ get }) => get(tasksState).find((t) => t.id === id),
})

export const taskState = atomFamily<TaskType | undefined, number>({
  key: 'taskState',
  default: (id: number) => currentTaskState(id),
})
// export const currentTaskState = atomFamily<TaskType | null, TaskType>({
//   key: 'currentTaskState',
//   default: (task) => task,
// })

export const assignedMembersState = selectorFamily<User[] | undefined, number>({
  key: 'assignedMembersState',
  get: (id: number) => ({ get }) => {
    return get(taskState(id))?.assignedMembers
  },
})
