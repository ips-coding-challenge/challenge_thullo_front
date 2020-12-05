import React from 'react'
import { useRecoilValue } from 'recoil'
import { taskState } from '../../../state/taskState'

type TaskCoverProps = {
  id: number
  large?: boolean
  onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}

const TaskCover = ({ id, large, onClick }: TaskCoverProps) => {
  const task = useRecoilValue(taskState(id!))
  return (
    <>
      {task && task.cover ? (
        <img
          className={`w-full ${
            large ? 'h-32' : 'h-24'
          } bg-gray1 rounded-lg mb-6 object-cover`}
          src={task.cover}
          alt="cover"
          onClick={onClick}
        />
      ) : (
        <div
          className={`w-full ${
            large ? 'h-32' : 'h-24'
          } bg-gray1 rounded-lg mb-6`}
        ></div>
      )}
    </>
  )
}

export default React.memo(TaskCover)
