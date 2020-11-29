import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../../../api/client'
import { boardState } from '../../../../state/boardState'
import { taskState } from '../../../../state/taskState'
import { userState } from '../../../../state/userState'
import { AttachmentType, TaskType } from '../../../../types/types'
import {
  avatarInitials,
  isAdmin,
  isOwner,
  truncate,
} from '../../../../utils/utils'
import Button from '../../../Common/Button'

type AttachmentProps = {
  attachment: AttachmentType
}

const Attachment = ({ attachment }: AttachmentProps) => {
  const user = useRecoilValue(userState)
  const board = useRecoilValue(boardState)
  const setTask = useSetRecoilState(taskState(attachment.task_id))

  const isImage = () => {
    if (attachment.format) {
      return ['jpg', 'jpeg', 'png'].includes(attachment.format)
    }
    return false
  }

  const deleteAttachment = async () => {
    try {
      await client.delete('/attachments', {
        data: {
          attachment_id: attachment.id,
          task_id: attachment.task_id,
        },
      })

      setTask((old: TaskType | undefined) => {
        if (old) {
          const copy = { ...old }
          if (copy.attachments) {
            const index = copy.attachments.findIndex(
              (el) => el.id === attachment.id
            )
            let newAttachments = [...copy.attachments]
            if (index > -1) {
              newAttachments.splice(index, 1)
              return { ...copy, attachments: newAttachments }
            }

            return old
          }
        }
        return old
      })
    } catch (e) {
      console.log('deleteAttachment error', e)
    }
  }

  const canDelete = () => {
    const owner = isOwner(user!, attachment)
    const admin = isAdmin(user!, board!)

    console.log('owner / admin', owner, admin)
    return owner || admin
  }

  return (
    <div className="flex my-4">
      {isImage() ? (
        <img
          className="w-24 h-16 rounded-lg object-cover mr-4"
          src={attachment.url}
          alt="attachment"
        />
      ) : (
        <div className="w-24 h-16 rounded-lg bg-gray4 mr-4 flex items-center justify-center text-gray2 text-xs font-semibold p-4">
          {avatarInitials(attachment.name)}
        </div>
      )}

      <div className="flex flex-col">
        <div className="text-xs text-gray3">{attachment.created_at}</div>
        <div className="text-sm">{truncate(attachment.name, 20)}</div>
        <div className="flex">
          <Button
            className="mr-2"
            variant="bordered"
            text="Download"
            size="sm"
            textSize="xs"
            alignment="left"
            onClick={() => {}}
          />
          {canDelete() && (
            <Button
              variant="bordered"
              text="Delete"
              size="sm"
              textSize="xs"
              alignment="left"
              onClick={deleteAttachment}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Attachment
