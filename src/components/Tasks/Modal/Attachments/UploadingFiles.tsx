import React from 'react'
import { useRecoilValue } from 'recoil'
import { filesStateForTask } from '../../../../state/fileState'
import { taskModalShowState } from '../../../../state/taskState'
import FileProgressBar from './FileProgressBar'

const UploadingFiles = () => {
  const taskId = useRecoilValue(taskModalShowState).task_id
  const uploadingFiles = useRecoilValue(filesStateForTask(taskId!))

  return (
    <div className="mt-4 mr-4">
      {uploadingFiles && uploadingFiles.length > 0 && (
        <div>
          {uploadingFiles.map((f: any, index: number) => (
            <FileProgressBar key={index} fileId={f.id} />
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(UploadingFiles)
