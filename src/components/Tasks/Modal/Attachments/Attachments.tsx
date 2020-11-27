import React from 'react'
import { MdDescription } from 'react-icons/md'
import { useRecoilValue } from 'recoil'
import {
  taskAttachmentsState,
  taskModalShowState,
} from '../../../../state/taskState'
import { AttachmentType } from '../../../../types/types'
import FileInput from '../../../Common/FileInput'
import TaskSubtitle from '../TaskSubtitle'
import UploadingFiles from './UploadingFiles'

const Attachments = () => {
  const taskId = useRecoilValue(taskModalShowState).task_id
  const attachments = useRecoilValue(taskAttachmentsState(taskId!))

  return (
    <div className="mt-8 ">
      <div className="flex items-center">
        <TaskSubtitle icon={<MdDescription />} text="Attachments" />
        <FileInput />
      </div>

      {attachments && attachments.length > 0 && (
        <div>
          <h5>Real attachments</h5>
          {attachments.map((at: AttachmentType) => (
            <div>{at.name}</div>
          ))}
        </div>
      )}

      <UploadingFiles />
    </div>
  )
}

export default React.memo(Attachments)
