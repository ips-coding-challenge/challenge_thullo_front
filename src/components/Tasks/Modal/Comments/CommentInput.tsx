import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  commentsState,
  taskModalShowState,
  taskState,
} from '../../../../state/taskState'
import { userState } from '../../../../state/userState'
import { avatarInitials } from '../../../../utils/utils'
import Button from '../../../Common/Button'
import Avatar from '../../../Header/Avatar'
import * as yup from 'yup'
import client from '../../../../api/client'
import { CommentType, TaskType } from '../../../../types/types'
import BasicError from '../../../Common/BasicError'
import { toast } from 'react-toastify'

export const commentSchema = yup.object().shape({
  content: yup.string().min(2).required(),
})

const CommentInput = () => {
  const user = useRecoilValue(userState)
  const taskId = useRecoilValue(taskModalShowState).task_id
  const setComments = useSetRecoilState(commentsState(taskId!))

  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const addComment = async () => {
    setError(null)
    try {
      await commentSchema.validate({ content })

      const res = await client.post('comments', {
        content,
        task_id: taskId,
      })

      setContent('')

      setComments((old: CommentType[] | undefined) => {
        if (!old) return old

        return old.concat(res.data.data)
      })

      toast.success('Comment added')
    } catch (e) {
      setError(e.message)
      console.log('e', e)
    }
  }

  return (
    <div className="rounded-lg border border-gray-border shadow-lg p-4">
      <div className="flex">
        <Avatar className="mr-4" username={user!.username} />
        <div className="w-full mb-2">
          <textarea
            className="w-full text-sm p-1"
            placeholder="Write a comment..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {error && <em className="text-danger text-xs">{error}</em>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="primary" text="Comment" onClick={addComment} />
      </div>
    </div>
  )
}

export default CommentInput
