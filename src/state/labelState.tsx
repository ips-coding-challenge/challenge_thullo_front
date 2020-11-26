import { atom } from 'recoil'
import { LabelType } from '../types/types'

export const labelsState = atom<LabelType[]>({
  key: 'labelsState',
  default: [],
})
