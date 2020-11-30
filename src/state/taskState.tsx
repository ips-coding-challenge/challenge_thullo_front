import { get } from 'react-hook-form'
import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import { number } from 'yup'
import {
  AttachmentType,
  CommentType,
  LabelType,
  TaskType,
  User,
} from '../types/types'

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

export const assignedMembersState = selectorFamily<User[] | undefined, number>({
  key: 'assignedMembersState',
  get: (id: number) => ({ get }) => {
    return get(taskState(id))?.assignedMembers
  },
})

export const labelsAssignedState = selectorFamily<
  LabelType[] | undefined,
  number
>({
  key: 'labelsAssignedState',
  get: (id: number) => ({ get }) => {
    return get(taskState(id))?.labels
  },
})

export const taskAttachmentsState = selectorFamily<
  AttachmentType[] | undefined,
  number
>({
  key: 'taskAttachmentsState',
  get: (id: number) => ({ get }) => {
    return get(taskState(id))?.attachments
  },
})

export const commentsState = atomFamily<CommentType[] | undefined, number>({
  key: 'commentsState',
  default: selectorFamily({
    key: 'commentsSelector',
    get: (id) => ({ get }) => {
      return get(taskState(id))?.comments
    },
  }),
})

export const singleCommentState = atomFamily<
  CommentType | undefined,
  { commentId: number; taskId: number }
>({
  key: 'singleCommentState',
  default: selectorFamily({
    key: 'singleCommentSelector',
    get: ({ commentId, taskId }) => ({ get }) => {
      return get(commentsState(taskId))?.find(
        (c: CommentType) => c.id === commentId
      )
    },
  }),
})
// export const commentsState = selectorFamily<CommentType[] | undefined, number>({
//   key: 'commentsState',
//   get: (id: number) => ({ get }) => {
//     return get(taskState(id))?.comments
//   },
//   set: (id: number) => ({get, set}, value) => {

//   }
// })

export const taskCoverSelector = selectorFamily<string | undefined, number>({
  key: 'coverSelector',
  get: (id: number) => ({ get }) => {
    const task = get(taskState(id))
    if (task) {
      return task.cover
    }
    return task
  },
})

export const taskModalShowState = atom<{
  task_id: number | null
  show: boolean
}>({
  key: 'taskModalState',
  default: {
    task_id: null,
    show: false,
  },
})
