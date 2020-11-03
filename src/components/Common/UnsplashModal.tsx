import React from 'react'
import Modal, { ModalProps } from './Modal'

const UnsplashModal = ({ isVisible }: ModalProps) => {
  return (
    <Modal isVisible={isVisible}>
      <h1>Unsplash</h1>
    </Modal>
    // <div className={`${className} fixed top-0 left-0 w-24 h-32 bg-red-600`}>
    //   <h1>Unsplash</h1>
    // </div>
  )
}

export default UnsplashModal
