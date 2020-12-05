import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'
import { useRecoilState } from 'recoil'
import * as yup from 'yup'
import client from '../../api/client'
import { selectedPhotoState } from '../../state/unsplashState'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import UnsplashDropdown from '../Common/Unsplash/UnsplashDropdown'
import VisibilityDropdown from '../Common/Visibility/VisibilityDropdown'
import BasicInput from '../Form/BasicInput'

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

  const [cover, setCover]: any = useRecoilState(selectedPhotoState)

  const [serverErrors, setServerErrors] = useState<any>(null)
  const [visibility, setVisibility] = useState<string>('private')

  useEffect(() => {
    return () => {
      setCover(null)
    }
  }, [])

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
        cover: cover.urls.regular,
        visibility,
      })

      console.log('res', res.data)
      onCreated(res.data.data)
      setCover(null)
    } catch (e) {
      console.log('Create board error', e)
      setServerErrors(e)
    }
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="p-4">
        {cover ? (
          <img
            className="w-full h-24 bg-gray1 rounded-lg mb-6 object-cover"
            src={cover ? cover?.urls.regular : ''}
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
            <div className="relative flex flex-col w-1/2">
              <UnsplashDropdown />
            </div>
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
