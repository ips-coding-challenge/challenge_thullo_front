import React, { useEffect, useRef, useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listState } from '../../state/listState'
import { ListOfTasks } from '../../types/types'
import ListInput from './ListInput'

type ListProps = {
  board_id: number
  list: ListOfTasks
}

const List = ({ board_id, list }: ListProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const setLists = useSetRecoilState(listState)

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

  const deleteList = async () => {
    try {
      await client.delete(`/lists/${list.id}`, {
        data: {
          board_id: list.board_id,
        },
      })

      setLists((old: ListOfTasks[]) => {
        const index = old.findIndex((el: ListOfTasks) => el.id === list.id)
        if (index > -1) {
          const copy = [...old]

          copy.splice(index, 1)
          return copy
        } else {
          return old
        }
      })
    } catch (e) {
      console.log('Delete list error', e)
    }
  }

  return (
    <div className="relative flex w-list justify-between items-center">
      {edit ? (
        <ListInput board_id={board_id} list={list} setEdit={setEdit} />
      ) : (
        <>
          <h3>{list.name}</h3>
          <MdMoreHoriz
            onClick={() => {
              setShowMenu(true)
            }}
            className="cursor-pointer hover:text-blue transition-colors duration-300"
          />
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-0 right-0 bg-white rounded-lg shadow-lg mt-6 py-3 px-4 z-10"
            >
              <div
                onClick={() => setEdit(true)}
                className="cursor-pointer text-gray2 hover:text-black duration-300 transition-colors"
              >
                Edit
              </div>
              <div
                onClick={deleteList}
                className="cursor-pointer text-danger hover:text-red-700 duration-300 transition-colors"
              >
                Delete
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default React.memo(List)
