import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '../Common/Modal'
import { ModalProps } from '../Common/Modal'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import BasicInput from '../Form/BasicInput'
import Button from '../Common/Button'
import { MdAdd, MdImage } from 'react-icons/md'
import UnsplashModal from '../Common/UnsplashModal'
import Axios from 'axios'
import client from '../../api/client'
import VisibilityDropdown from '../Common/Visibility/VisibilityDropdown'

const schema = yup.object().shape({
  name: yup.string().required(),
})

type CreateBoardModalProps = {
  isVisible: boolean
  onClose: () => void
  onCreated: (board: any) => void
}

const CreateBoardModal = ({
  isVisible,
  onClose,
  onCreated,
}: CreateBoardModalProps) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [serverErrors, setServerErrors] = useState<any>(null)
  const [showUnsplashModal, setShowUnsplashModal] = useState<boolean>(false)
  const [cover, setCover] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<string>('private')
  const [photos, setPhotos] = useState<any[]>([])
  const PARAMS = '&per_page=9&order_by=popular'

  const createBoard = async (data: any) => {
    setServerErrors(null)
    if (!cover) {
      setServerErrors({
        field: 'cover',
        message: 'You should choose a cover image',
      })
    }
    try {
      const res = await client.post('/boards', {
        name: data.name,
        cover,
        visibility,
      })

      console.log('res', res.data)
      onCreated(res.data.data)
    } catch (e) {
      console.log('Create board error', e)
      setServerErrors(e)
    }
  }
  const fetchPhotos = useCallback(async () => {
    try {
      const res = await Axios.get(
        `https://api.unsplash.com/photos/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}${PARAMS}`
      )
      setPhotos(res.data)
      console.log('res', res.data)
    } catch (e) {
      console.log('Error fetching photos', e)
    }
  }, [])

  const searchPhotos = async (query: string) => {
    try {
      const res = await Axios.get(
        `https://api.unsplash.com/search/photos/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}${PARAMS}&query=${query}`
      )
      setPhotos(res.data.results)
      console.log('res', res.data)
    } catch (e) {
      console.log('Error fetching photos', e)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const selectPhoto = (photo: any) => {
    if (serverErrors && serverErrors.field && serverErrors.field === 'cover') {
      setServerErrors(null)
    }
    setCover(() => photo.urls.regular)
    setShowUnsplashModal(false)
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="p-4">
        {cover ? (
          <img
            className="w-full h-24 bg-gray1 rounded-lg mb-6 object-cover"
            src={cover ? cover : ''}
            alt="cover"
          />
        ) : (
          <div className="w-full h-24 bg-gray1 rounded-lg mb-6"></div>
        )}

        <form onSubmit={handleSubmit(createBoard)}>
          {serverErrors && (
            <p className="text-red-500 mb-4 text-sm">{serverErrors.message}</p>
          )}

          <BasicInput
            className=""
            type="text"
            name="name"
            placeholder="Add a board title"
            ref={register}
            error={errors.name?.message}
          />

          <div className="relative flex my-6">
            <Button
              className="w-1/2 mr-4"
              icon={<MdImage />}
              text="cover"
              alignment="left"
              variant="default"
              onClick={() => {
                setShowUnsplashModal((old) => !old)
              }}
            />
            <UnsplashModal
              isVisible={showUnsplashModal}
              photos={photos}
              selectPhoto={selectPhoto}
              searchPhotos={searchPhotos}
            />
            <div className="relative flex flex-col ml-4 w-1/2">
              <VisibilityDropdown
                visibility={visibility}
                setVisibility={setVisibility}
              />
            </div>
          </div>

          {/* <LoadingButton text="Login" type="submit" loading={loading} /> */}

          {/* Action */}
          <div className="flex justify-end">
            <Button
              className="mr-4"
              text="Cancel"
              variant="blank"
              onClick={onClose}
            />
            <Button
              type="submit"
              text="Save"
              icon={<MdAdd />}
              alignment="left"
              variant="primary"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CreateBoardModal
