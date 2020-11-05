import React, { useRef, useState } from 'react'
import Modal from '../Common/Modal'
import { ModalProps } from '../Common/Modal'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import BasicInput from '../Form/BasicInput'
import Button from '../Common/Button'
import { MdAdd, MdImage, MdLock } from 'react-icons/md'
import UnsplashModal from '../Common/UnsplashModal'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const CreateBoardModal = ({ isVisible, onClose }: ModalProps) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const [serverErrors, setServerErrors] = useState<any>(null)
  const [showUnsplashModal, setShowUnsplashModal] = useState<boolean>(false)
  const [cover, setCover] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<string>('private')

  const createBoard = (data: any) => {}
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="p-4">
        {cover ? (
          <img
            className="w-full h-24 bg-gray1 rounded-lg mb-6"
            src=""
            alt="cover"
          />
        ) : (
          <div className="w-full h-24 bg-gray1 rounded-lg mb-6"></div>
        )}

        <form onSubmit={handleSubmit(createBoard)}>
          {serverErrors && (
            <p className="text-red-500 mb-4">{serverErrors.message}</p>
          )}

          <BasicInput
            className="mb-6"
            type="text"
            name="name"
            placeholder="Add a board title"
            ref={register}
            error={errors.name?.message}
          />

          <div className="relative flex mb-6">
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
            <UnsplashModal isVisible={showUnsplashModal} />
            <Button
              className="w-1/2 ml-4"
              icon={<MdLock />}
              text="Private"
              alignment="left"
              variant="default"
              onClick={() => {}}
            />
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
              text="Save"
              icon={<MdAdd />}
              alignment="left"
              variant="primary"
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CreateBoardModal
