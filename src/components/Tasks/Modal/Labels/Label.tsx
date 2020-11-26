import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../../../api/client'
import { taskModalShowState, taskState } from '../../../../state/taskState'
import { LabelType, TaskType } from '../../../../types/types'

type LabelProps = {
  can: boolean
  label: LabelType
}
const Label = ({ can, label }: LabelProps) => {
  // Only need if the modal is opened
  const taskId = useRecoilValue(taskModalShowState).task_id
  const setTask = useSetRecoilState(taskState(taskId!))

  const addLabelToTask = async () => {
    if (!taskId || !can) {
      return
    }

    try {
      await client.post(`/tasks/${taskId}/labels`, {
        task_id: taskId,
        label_id: label.id,
      })
      setTask((old: TaskType | undefined) => {
        if (old) {
          return {
            ...old,
            labels: old?.labels.concat(label),
          }
        }
        return old
      })
      // console.log('res', res.data)
    } catch (e) {
      console.log('e', e)
    }
  }

  return (
    <div
      onClick={addLabelToTask}
      style={{ backgroundColor: label.color }}
      className={`rounded-2xl w-auto px-4 py-1 cursor-pointer hover:opacity-80 transition-opacity duration-300`}
    >
      <h5 className="text-white text-xs">{label.name}</h5>
    </div>
  )
}

export default Label
