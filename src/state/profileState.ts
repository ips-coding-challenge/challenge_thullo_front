import { atom, selector } from 'recoil'

export type UploadAvatarType = {
  progress: number
  finished: boolean
}

export const uploadAvatarState = atom<UploadAvatarType>({
  key: 'uploadAvatarState',
  default: {
    progress: 0,
    finished: false,
  },
})

export const uploadAvatarProgress = selector<number>({
  key: 'uploadAvatarProgress',
  get: ({ get }) => {
    return get(uploadAvatarState).progress
  },
})
