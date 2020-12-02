import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import client from '../../../../api/client'
import { taskLabelsState } from '../../../../state/labelState'
import { LabelType } from '../../../../types/types'
import Label from './Label'

const Labels = ({ taskId }: any) => {
  const [assignedLabels, setLabel] = useRecoilState(taskLabelsState(taskId))

  const deleteLabel = useCallback(async (label: LabelType) => {
    try {
      await client.delete(`/tasks/${taskId!}/labels`, {
        data: {
          task_id: taskId,
          label_id: label.id,
        },
      })
      setLabel((labels: LabelType[] | undefined) => {
        if (!labels) return labels

        const copy = [...labels]
        const index = copy.findIndex((el) => el.id === label.id)
        copy.splice(index, 1)
        return copy
      })
    } catch (e) {
      console.log('deleteFromTask error', e)
    }
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {assignedLabels && assignedLabels.length > 0 && (
        <>
          {assignedLabels.map((label: LabelType) => (
            <Label
              can={false}
              key={label.id}
              label={label}
              deleteLabel={deleteLabel}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default React.memo(Labels)
