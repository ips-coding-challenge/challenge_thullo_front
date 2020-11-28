import React from 'react'
import { useRecoilValue } from 'recoil'
import { fileProgressState } from '../../../../state/fileState'

type FileProgressFillProps = {
  fileId: string
}

const FileProgressFill = ({ fileId }: FileProgressFillProps) => {
  const file = useRecoilValue(fileProgressState(fileId))
  return (
    <div
      style={{ width: `${file?.progress}%` }}
      className={`bg-blue rounded-full h-3`}
    ></div>
  )
}

export default React.memo(FileProgressFill)
