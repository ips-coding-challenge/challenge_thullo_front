import React from 'react'
import { MdSearch } from 'react-icons/md'

type UnsplashModal = {
  isVisible: boolean
}

const UnsplashModal = ({ isVisible }: UnsplashModal) => {
  return !isVisible ? null : (
    <div
      style={{ left: '0', top: '50px' }}
      className="absolute w-64 h-32 bg-white rounded-lg shadow-lg p-4"
    >
      <h2 className="text-gray2 text-base mb-2">Photo Search</h2>
      <h3 className="text-gray3 text-sm mb-4">Search Unsplash for photos</h3>

      <div className="rounded-lg shadow-md h-10 flex justify-between items-center p-1 mb-4">
        <input
          className="min-w-0"
          type="text"
          name="search"
          placeholder="Keywords..."
        />
        <button className="bg-blue rounded-lg h-full px-4 text-white text-sm">
          <MdSearch />
        </button>
      </div>
    </div>
  )
}

export default UnsplashModal
