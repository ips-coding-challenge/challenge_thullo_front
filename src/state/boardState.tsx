import { atom } from 'recoil'
import { Board, User } from '../types/types'

export const boardState = atom<Board | null>({
  key: 'boardState',
  default: null,
})

export const boardMembersState = atom<User[]>({
  key: 'boardMembers',
  default: [],
})
