import { atom } from 'recoil'
import { Board } from '../types/types'

export const boardState = atom<Board | null>({
  key: 'boardState',
  default: null,
})
