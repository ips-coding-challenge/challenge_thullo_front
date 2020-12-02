import { atom, atomFamily, selectorFamily } from 'recoil'
import { LabelType } from '../types/types'
import { taskState } from './taskState'

export const labelsState = atom<LabelType[]>({
  key: 'labelsState',
  default: [],
})

export const taskLabelsState = atomFamily<LabelType[] | undefined, number>({
  key: 'taskLabelsState',
  default: selectorFamily({
    key: 'taskLabelsSelector',
    get: (id: number) => ({ get }) => {
      return get(taskState(id))?.labels
    },
  }),
})
