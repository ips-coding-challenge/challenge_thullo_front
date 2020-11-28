import React from 'react'
import { useRecoilValue } from 'recoil'
import { fileState } from '../../../../state/fileState'
import { FileType } from '../../../../types/types'
import { avatarInitials, truncate } from '../../../../utils/utils'
import FileProgressFill from './FileProgressFill'

type FileProgressBarProps = {
  fileId: string
}

const FileProgressBar = ({ fileId }: FileProgressBarProps) => {
  const file = useRecoilValue(fileState(fileId))

  if (!file) return null
  return (
    <div className="flex items-center justify-between my-2">
      <div className="w-24 h-16 flex-none rounded-lg bg-gray4 mr-4 flex items-center justify-center text-gray2 text-xs font-semibold p-4">
        {avatarInitials(file.name)}
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-full shadow-inner rounded-full h-3 mt-2">
          <FileProgressFill fileId={file.id} />
        </div>
        <div className="text-xs text-gray3">{truncate(file.name, 20)}</div>
      </div>
    </div>
  )
}

export default React.memo(FileProgressBar)
