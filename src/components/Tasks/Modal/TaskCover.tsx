import React from 'react'
import { useRecoilValue } from 'recoil'
import { taskCoverSelector, taskState } from '../../../state/taskState'

type TaskCoverProps = {
  id: number
  onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}

const TaskCover = ({ id, onClick }: TaskCoverProps) => {
  const task = useRecoilValue(taskState(id!))
  return (
    <>
      {task && task.cover ? (
        <img
          className="w-full h-24 bg-gray1 rounded-lg mb-6 object-cover"
          src={task.cover}
          alt="cover"
          onClick={onClick}
        />
      ) : (
        <div className="w-full h-24 bg-gray1 rounded-lg mb-6"></div>
      )}
    </>
  )
}

export default React.memo(TaskCover)
