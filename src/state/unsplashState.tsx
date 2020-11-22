import { atom } from 'recoil'

export const photosState = atom({
  key: 'photosState',
  default: [],
})

export const pageState = atom({
  key: 'pageState',
  default: 1,
})

export const selectedPhotoState = atom({
  key: 'selectedPhotoState',
  default: null,
})
