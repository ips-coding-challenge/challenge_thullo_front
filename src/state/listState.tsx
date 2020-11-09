import { atom, selectorFamily } from 'recoil'
import { ListOfTasks } from '../types/types'

export const listState = atom<ListOfTasks[]>({
  key: 'list',
  default: [],
})

export const currentListState = selectorFamily({
  key: 'currentList',
  get: (id) => ({ get }) => {
    return get(listState).find((list: ListOfTasks) => list.id === id)
  },
})
