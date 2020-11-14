import React, { useCallback, useState } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import {
  currentListState,
  listItemState,
  listState,
} from '../../state/listState'
import { ListOfTasks } from '../../types/types'
import ListDropdown from './ListDropdown'
import ListInput from './ListInput'

type ListHeadingProps = {
  board_id: number
  list: ListOfTasks
}

const ListHeading = ({ board_id, list }: ListHeadingProps) => {
  const listItem = useRecoilValue(listItemState(list))
  const [edit, setEdit] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const setLists = useSetRecoilState(listState)

  const deleteList = useCallback(async () => {
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
  }, [])

  return (
    <div className="w-full flex justify-between items-center">
      {edit ? (
        <ListInput board_id={board_id} list={list} setEdit={setEdit} />
      ) : (
        <>
          <div className="flex justify-between w-full items-center mb-4">
            <h3>{listItem?.name}</h3>
            <MdMoreHoriz
              onClick={() => {
                setShowMenu(true)
              }}
              className="cursor-pointer hover:text-blue transition-colors duration-300"
            />
          </div>
          {showMenu && (
            <ListDropdown
              setShowMenu={setShowMenu}
              setEdit={setEdit}
              deleteList={deleteList}
            />
          )}
        </>
      )}
    </div>
  )
}

export default React.memo(ListHeading)
