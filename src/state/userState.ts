import { atom } from 'recoil'
import { User } from '../types/types'

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})
