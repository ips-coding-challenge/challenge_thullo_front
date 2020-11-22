import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  pageState,
  photosState,
  selectedPhotoState,
} from '../../../state/unsplashState'

const PhotoGallery = () => {
  const [photos] = useRecoilState(photosState)
  const setSelectedPhoto = useSetRecoilState(selectedPhotoState)
  const [page, setPage] = useRecoilState(pageState)

  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 mb-4">
        {photos.map((photo: any) => {
          return (
            <li
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                console.log('photo selected', photo)
                setSelectedPhoto(photo)
              }}
              key={photo.id}
            >
              <img
                className="w-24 h-16 object-cover rounded"
                src={photo.urls.thumb}
                alt="Thumbnail"
              />
            </li>
          )
        })}
      </ul>
      <div className="flex justify-between w-full">
        {page > 1 && (
          <span
            className="text-sm hover:text-gray3 cursor-pointer"
            onClick={() => {
              setPage(page - 1)
            }}
          >
            Prev
          </span>
        )}
        {page === 1}
        <span></span>
        <span
          className="text-sm hover:text-gray3 cursor-pointer"
          onClick={() => {
            setPage(page + 1)
          }}
        >
          Next
        </span>
      </div>
    </div>
  )
}

export default PhotoGallery
