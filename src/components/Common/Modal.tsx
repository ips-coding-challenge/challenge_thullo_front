import React from 'react'

export type ModalProps = {
  isVisible: boolean
  children?: JSX.Element
  onDelete?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClose?: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void
  onClickOutside?: (event: React.MouseEvent) => void
}

const Modal = ({
  isVisible,
  children,
  onDelete,
  onClose,
  onClickOutside,
}: ModalProps) => {
  return !isVisible ? null : (
    <div
      className="fixed z-50 inset-0 overflow-y-auto"
      onClick={onClickOutside}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray3 opacity-50"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-top sm:h-screen"></span>
        &#8203;
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{ top: '8px', right: '8px' }}
            className="absolute text-3xl bg-blue flex justify-center items-center w-8 h-8 rounded-lg text-white cursor-pointer hover:text-primary transition-colors duration-200"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
