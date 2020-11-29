import React from 'react'
import { useRecoilValue } from 'recoil'
import { boardState } from '../../../../state/boardState'
import { userState } from '../../../../state/userState'
import { CommentType } from '../../../../types/types'
import { isAdmin, isOwner } from '../../../../utils/utils'
import Button from '../../../Common/Button'
import Avatar from '../../../Header/Avatar'

type CommentProps = {
  comment: CommentType
}

const Comment = ({ comment }: CommentProps) => {
  const user = useRecoilValue(userState)
  const board = useRecoilValue(boardState)

  const can = () => {
    const owner = isOwner(user!, comment)
    const admin = isAdmin(user!, board!)

    return owner || admin
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

      <div className="mt-4">{comment.content}</div>
    </div>
  )
}

export default Comment
