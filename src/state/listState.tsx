import { atom, atomFamily, selectorFamily } from 'recoil'
import { ListOfTasks } from '../types/types'

export const listState = atom<ListOfTasks[]>({
  key: 'list',
  default: [],
})

export const listItemState = atomFamily({
  key: 'listItem',
  default: (list: any) => (list ? list : null),
})

export const currentListState = selectorFamily({
  key: 'currentList',
  get: (id) => ({ get }) => {
    return get(listState).find((list: ListOfTasks) => list.id === id)
  },
  set: (id) => ({ get, set }, value: any) => {
    set(currentListState(id), value)
  },
})
