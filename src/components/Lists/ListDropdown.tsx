import React, { useEffect, useRef } from 'react'

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
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [menuRef])

  const onClickOutside = (e: any) => {
    if (menuRef && !menuRef.current?.contains(e.target)) {
      setShowMenu(false)
    }
  }
  return (
    <div
      ref={menuRef}
      style={{ right: '-9rem' }}
      className="absolute w-40 top-0 bg-white rounded-card shadow-lg mt-6 py-3 px-4 z-10 border border-gray-border"
    >
      <div
        onClick={() => {
          setEdit(true)
          setShowMenu(false)
        }}
        className="p-2 cursor-pointer text-gray2 hover:text-black duration-300 transition-colors"
      >
        Rename
      </div>
      <hr />
      <div
        onClick={deleteList}
        className="p-2 cursor-pointer text-gray2 hover:text-black duration-300 transition-colors"
      >
        Delete this list
      </div>
    </div>
  )
}

export default React.memo(ListDropdown)
