import React from 'react'
import { MdDescription } from 'react-icons/md'
import { useRecoilValue } from 'recoil'
import { uploadErrorForTask } from '../../../../state/fileState'
import {
  taskAttachmentsState,
  taskModalShowState,
} from '../../../../state/taskState'
import { AttachmentType, UploadError } from '../../../../types/types'
import FileInput from '../../../Common/FileInput'
import TaskSubtitle from '../TaskSubtitle'
import Attachment from './Attachment'
import UploadingFiles from './UploadingFiles'

const Attachments = () => {
  const taskId = useRecoilValue(taskModalShowState).task_id
  const attachments = useRecoilValue(taskAttachmentsState(taskId!))
  const uploadErrors = useRecoilValue(uploadErrorForTask(taskId!))

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <TaskSubtitle icon={<MdDescription />} text="Attachments" />
        <FileInput />
      </div>

      {uploadErrors && uploadErrors.length > 0 && (
        <div className="bg-red-500 p-2 w-full my-2 rounded-lg">
          {uploadErrors.map((e: UploadError, index: number) => (
            <div key={index} className="text-sm text-white">
              {e.filename}: {e.message}
            </div>
          ))}
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <div>
          {attachments.map((attachment: AttachmentType) => (
            <Attachment key={attachment.id} attachment={attachment} />
          ))}
        </div>
      )}

      <UploadingFiles />
    </div>
  )
}

export default React.memo(Attachments)
