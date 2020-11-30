import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdAdd, MdDescription, MdEdit } from 'react-icons/md'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { boardDescriptionState, boardState } from '../../state/boardState'
import { Board } from '../../types/types'
import { formatServerErrors } from '../../utils/utils'
import Button from '../Common/Button'
import TaskSubtitle from '../Tasks/Modal/TaskSubtitle'

const BoardDescription = () => {
  const board = useRecoilValue(boardState)
  const [boardDescription, setBoardDescription] = useRecoilState(
    boardDescriptionState(board?.id!)
  )
  const [edit, setEdit] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState<string>(
    board?.description || ''
  )
  const ref = useRef<HTMLTextAreaElement>(null)

  const saveDescription = useCallback(async () => {
    setError(null)

    try {
      const res = await client.put(`/boards/${board?.id!}`, {
        description,
      })

      setEdit(false)

      setBoardDescription((old: any) => {
        if (!old) return old

        return res.data.data.description
      })

      console.log('res', res.data)
    } catch (e) {
      setError(formatServerErrors(e))
      console.log('Error', e)
    }
  }, [description])

  useEffect(() => {
    if (edit && ref && ref.current) {
      ref.current.focus()
    }
  }, [ref, edit])

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <TaskSubtitle icon={<MdDescription />} text="Description" />
        <Button
          variant="bordered"
          text={board?.description ? 'Edit' : 'Add'}
          size="sm"
          textSize="xs"
          alignment="left"
          icon={board?.description ? <MdEdit /> : <MdAdd />}
          onClick={() => setEdit((val) => (val = !val))}
        />
      </div>
      {edit && (
        <>
          {error && <p className="text-danger text-sm p-2">{error}</p>}
          <textarea
            ref={ref}
            rows={5}
            className="w-full mt-3 text-sm p-1"
            placeholder="Add a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <Button text="Save" onClick={saveDescription} variant="primary" />
        </>
      )}
      {boardDescription && !edit && <p className="mt-4">{boardDescription}</p>}
    </div>
  )
}

export default BoardDescription
