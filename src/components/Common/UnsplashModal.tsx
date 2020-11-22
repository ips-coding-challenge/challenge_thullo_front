import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

type UnsplashModal = {
  isVisible: boolean
  photos: any[]
  page: number
  setPage: (page: number) => void
  selectPhoto: (photo: any) => void
  searchPhotos: (query: string) => void
}

const UnsplashModal = ({
  isVisible,
  photos,
  page,
  setPage,
  selectPhoto,
  searchPhotos,
}: UnsplashModal) => {
  const [query, setQuery] = useState<string>('')

  return !isVisible ? null : (
    <div
      style={{ left: '0', top: '50px' }}
      className="absolute w-64 bg-white rounded-lg shadow-lg p-4"
    >
      <h2 className="text-gray2 text-base mb-2">Photo Search</h2>
      <h3 className="text-gray3 text-sm mb-4">Search Unsplash for photos</h3>

      <div className="rounded-lg shadow-md h-10 flex justify-between items-center p-1 mb-4">
        <input
          className="min-w-0 text-sm"
          type="text"
          name="search"
          placeholder="Keywords..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              searchPhotos(query)
            }
          }}
        />
        <button
          onClick={() => searchPhotos(query)}
          className="bg-blue rounded-lg h-full px-4 text-white text-xs"
        >
          <MdSearch />
        </button>
      </div>

      {/* Photos */}
      <ul className="grid grid-cols-3 gap-2 mb-4">
        {photos.map((photo: any) => {
          return (
            <li
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                selectPhoto(photo)
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
        {page > 1}{' '}
        <span
          className="text-sm hover:text-gray3"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </span>
        <span
          className="text-sm hover:text-gray3"
          onClick={() => setPage(page + 1)}
        >
          Next
        </span>
      </div>
    </div>
  )
}

export default UnsplashModal
