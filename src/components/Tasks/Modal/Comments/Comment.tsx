import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ValidationError } from 'yup'
import client from '../../../../api/client'
import { boardState } from '../../../../state/boardState'
import { commentsState, taskState } from '../../../../state/taskState'
import { userState } from '../../../../state/userState'
import { CommentType, TaskType } from '../../../../types/types'
import { formatServerErrors, isAdmin, isOwner } from '../../../../utils/utils'
import Button from '../../../Common/Button'
import Avatar from '../../../Header/Avatar'
import { commentSchema } from './CommentInput'

type CommentProps = {
  comment: CommentType
}

const Comment = ({ comment }: CommentProps) => {
  // Global State
  const user = useRecoilValue(userState)
  const board = useRecoilValue(boardState)
  const comments = useRecoilValue(commentsState(comment.task_id))

  // Local State
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(comment.content)
  const [error, setError] = useState<string | null>(null)

  const can = () => {
    const owner = isOwner(user!, comment)
    const admin = isAdmin(user!, board!)

    return owner || admin
  }

  const updateComment = async () => {
    setError(null)
    try {
      await commentSchema.validate({ content: value })

      const res = await client.put(`/comments/${comment.id}`, {
        content: value,
        task_id: comment.task_id,
      })

      setEdit(false)
    } catch (e) {
      if (e instanceof ValidationError) {
        setError(e.message)
      } else {
        setError(formatServerErrors(e))
      }
      console.log('Error', e)
    }
  }

  return (
    <div className="w-full pt-3 pb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="mr-4" username={comment.username!} />
          <div>
            <div className="font-bold">{comment.username}</div>
            <div className="text-sm text-gray3">{comment.created_at}</div>
          </div>
        </div>
        {can() && (
          <div className="flex items-center">
            <Button
              text="Edit"
              variant="blank"
              textSize="xs"
              className="mr-1"
              onClick={() => setEdit(true)}
            />
            <p>-</p>
            <Button
              text="Delete"
              variant="blank"
              textSize="xs"
              className="ml-1"
            />
          </div>
        )}
      </div>

      {edit && (
        <div className="w-full my-2">
          <textarea
            className="w-full p-1"
            value={value}
            onBlur={() => {
              setError(null)
            }}
            autoFocus={true}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          {error && <em className="text-danger text-xs">{error}</em>}
          <div className="flex justify-end">
            <Button
              className="mr-2"
              variant="default"
              text="Cancel"
              onClick={() => setEdit(false)}
            />
            <Button variant="primary" text="Edit" onClick={updateComment} />
          </div>
        </div>
      )}
      {!edit && <div className="mt-4">{comment.content}</div>}
    </div>
  )
}

export default Comment
