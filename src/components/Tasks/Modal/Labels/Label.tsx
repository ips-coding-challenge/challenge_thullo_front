import React from 'react'
import { MdClose } from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../../../api/client'
import { taskLabelsState } from '../../../../state/labelState'
import { taskModalShowState, taskState } from '../../../../state/taskState'
import { LabelType, TaskType } from '../../../../types/types'

type LabelProps = {
  can: boolean
  label: LabelType
  deleteLabel?: (label: LabelType) => void
}
const Label = ({ can, label, deleteLabel }: LabelProps) => {
  // Only need if the modal is opened
  const taskId = useRecoilValue(taskModalShowState).task_id
  const setLabels = useSetRecoilState(taskLabelsState(taskId!))

  const addLabelToTask = async () => {
    if (!taskId || !can) {
      return
    }

    try {
      await client.post(`/tasks/${taskId}/labels`, {
        task_id: taskId,
        label_id: label.id,
      })

      setLabels((labels: LabelType[] | undefined) => {
        if (!labels) return labels

        return labels.concat(label)
      })
    } catch (e) {
      console.log('e', e)
    }
  }

  return (
    <div
      onClick={addLabelToTask}
      style={{ backgroundColor: label.color }}
      className={`relative rounded-2xl w-auto ${
        deleteLabel ? 'pl-4 pr-2' : 'px-4'
      } py-1 cursor-pointer hover:opacity-80 transition-opacity duration-300`}
    >
      <div className="flex justify-between items-center">
        <h5 className="text-white text-xs">{label.name}</h5>
        {deleteLabel && (
          <MdClose
            className="z-10 bg-white rounded-full text-lg ml-4 p-1 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => deleteLabel(label)}
          />
        )}
      </div>
    </div>
  )
}

export default Label
