import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ValidationError } from 'yup'
import client from '../../../../api/client'
import { boardState } from '../../../../state/boardState'
import {
  commentsState,
  singleCommentState,
  taskState,
} from '../../../../state/taskState'
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
  const setComments = useSetRecoilState(commentsState(comment.task_id))
  const [singleComment, setSingleComment] = useRecoilState(
    singleCommentState({ commentId: comment.id, taskId: comment.task_id })
  )

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

      setSingleComment((old: CommentType | undefined) => {
        if (!old) return old

        return res.data.data
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

  const deleteComment = async () => {
    try {
      await client.delete('/comments', {
        data: {
          comment_id: comment.id,
          task_id: comment.task_id,
        },
      })

      setComments((old: CommentType[] | undefined) => {
        if (!old) return old

        const copy = [...old]
        const index = copy.findIndex((c: CommentType) => c.id === comment.id)
        if (index > -1) {
          copy.splice(index, 1)
          return copy
        }
      })

      toast.warning('Comment deleted')
    } catch (e) {
      setError(formatServerErrors(e))
      console.log('Error', e)
    }
  }

  return (
    <div className="w-full pt-3 pb-6">
      {console.log('singleComment', singleComment)}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="mr-4" username={singleComment?.username!} />
          <div>
            <div className="font-bold">{singleComment?.username}</div>
            <div className="text-sm text-gray3">
              {singleComment?.created_at}
            </div>
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
              onClick={deleteComment}
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
      {!edit && <div className="mt-4">{singleComment?.content}</div>}
    </div>
  )
}

export default Comment
