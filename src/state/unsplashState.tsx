import { atom } from 'recoil'

export const photosState = atom({
  key: 'photosState',
  default: [],
})

// Allow to cache request
export const urlState = atom({
  key: 'urlState',
  default: '',
})

export const pageState = atom({
  key: 'pageState',
  default: 1,
})

export const selectedPhotoState = atom({
  key: 'selectedPhotoState',
  default: null,
})
