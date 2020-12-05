import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { MdImage, MdSearch } from 'react-icons/md'
import { useRecoilState } from 'recoil'
import { pageState, photosState, urlState } from '../../../state/unsplashState'
import BaseDropdown from '../BaseDropdown'
import Button from '../Button'
import PhotoGallery from './PhotoGallery'

const UnsplashDropdown = () => {
  const [page, setPage] = useRecoilState(pageState)
  const [photos, setPhotos] = useRecoilState(photosState)
  const [currentUrl, setCurrentUrl] = useRecoilState(urlState)

  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const PARAMS = '&per_page=9&order_by=popular'

  const fetchPhotos = useCallback(async () => {
    setLoading(true)

    try {
      const url = `https://api.unsplash.com/photos/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}${PARAMS}&page=${page}`
      if (currentUrl === url) return
      const res = await axios.get(url)
      setCurrentUrl(url)
      setPhotos(res.data)
      console.log('res', res.data)
    } catch (e) {
      console.log('Error fetching photos', e)
    } finally {
      setLoading(false)
    }
  }, [page])

  const searchPhotos = async (query: string) => {
    if (query.trim().length === 0) {
      // Will refetch the photos
      setPage(1)
      return
    }
    setLoading(true)
    try {
      const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}${PARAMS}&query=${query}&page=${page}`
      if (currentUrl === url) return
      const res = await axios.get(url)
      setPhotos(res.data.results)
      console.log('res', res.data)
    } catch (e) {
      console.log('Error fetching photos', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query.length === 0) {
      fetchPhotos()
    } else {
      searchPhotos(query)
    }
  }, [page])

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <div>
          <Button
            className="w-full"
            icon={<MdImage />}
            text="Cover"
            alignment="left"
            variant="default"
            onClick={(e) => {
              onTrigger(e)
            }}
          />
          {show && (
            <div className="absolute w-list top-0 bg-white rounded-card shadow-lg mt-10 py-3 px-4 z-10 border border-gray-border">
              <h2 className="text-gray2 text-base mb-2">Photo Search</h2>
              <h3 className="text-gray3 text-sm mb-4">
                Search Unsplash for photos
              </h3>

              <div className="rounded-lg shadow-md h-10 flex justify-between items-center p-1 mb-4">
                <input
                  className="min-w-0 text-sm p-1"
                  type="text"
                  name="search"
                  placeholder="Keywords..."
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setPage(1)
                      searchPhotos(query)
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setPage(1)
                    searchPhotos(query)
                  }}
                  className="bg-blue rounded-lg h-full px-4 text-white text-xs"
                >
                  <MdSearch />
                </button>
              </div>

              {/* Photos */}
              {loading && (
                <div className="flex w-full h-full items-center justify-center my-4">
                  <div className="lds-dual-ring lds-dual-ring-black"></div>
                </div>
              )}
              {!loading && photos.length > 0 && (
                <PhotoGallery onTrigger={onTrigger} />
              )}
            </div>
          )}
        </div>
      )}
    </BaseDropdown>
  )
}

export default UnsplashDropdown
