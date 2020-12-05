import React from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import BaseDropdown from '../Common/BaseDropdown'

type ListDropdownProps = {
  setShowMenu: (show: boolean) => void
  setEdit: (edit: boolean) => void
  deleteList: () => void
}

const ListDropdown = ({
  setShowMenu,
  setEdit,
  deleteList,
}: ListDropdownProps) => {
  return (
    <BaseDropdown mobile={true}>
      {(onTrigger, show) => (
        <>
          <MdMoreHoriz
            onClick={(e: React.MouseEvent) => onTrigger(e)}
            className="cursor-pointer hover:text-blue transition-colors duration-300"
          />
          {show && (
            <div
              style={{ right: '-9rem' }}
              className="absolute w-full md:w-40 top-0 left-0 md:left-auto bg-white rounded-card shadow-lg mt-6 py-3 px-4 z-10 border border-gray-border"
            >
              <div
                onClick={() => {
                  setEdit(true)
                  setShowMenu(false)
                }}
                className="dropdown-item"
              >
                Rename
              </div>
              <hr />
              <div onClick={deleteList} className="dropdown-item">
                Delete this list
              </div>
            </div>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default React.memo(ListDropdown)
