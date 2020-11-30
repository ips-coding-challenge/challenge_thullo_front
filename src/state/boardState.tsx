import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import { Board, User } from '../types/types'

export const boardState = atom<Board | null>({
  key: 'boardState',
  default: null,
})

export const boardMembersState = atom<User[]>({
  key: 'boardMembers',
  default: [],
})

export const boardDescriptionState = atomFamily({
  key: 'boardDescription',
  default: selector({
    key: 'description',
    get: ({ get }) => {
      return get(boardState)?.description
    },
  }),
})

export const boardMenuState = atom<boolean>({
  key: 'boardMenuState',
  default: false,
})
