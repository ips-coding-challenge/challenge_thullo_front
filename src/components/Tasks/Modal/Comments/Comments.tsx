import React from 'react'
import { useRecoilValue } from 'recoil'
import { commentsState, taskModalShowState } from '../../../../state/taskState'
import { CommentType } from '../../../../types/types'
import Comment from './Comment'
import CommentInput from './CommentInput'

const Comments = () => {
  const taskId = useRecoilValue(taskModalShowState).task_id
  const comments = useRecoilValue(commentsState(taskId!))

  return (
    <div className="w-full mt-8">
      <CommentInput />

      {comments && comments.length > 0 && (
        <div className="mt-6">
          {comments.map((c: CommentType, index: number) => (
            <div key={c.id}>
              <Comment comment={c} />
              {index < comments.length - 1 && <hr />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Comments
