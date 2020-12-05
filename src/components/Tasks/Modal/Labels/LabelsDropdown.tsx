import React, { useState } from 'react'
import { MdLabel } from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import * as yup from 'yup'
import client from '../../../../api/client'
import { boardState } from '../../../../state/boardState'
import { labelsState, taskLabelsState } from '../../../../state/labelState'
import { LabelType } from '../../../../types/types'
import BaseDropdown from '../../../Common/BaseDropdown'
import Button from '../../../Common/Button'
import TaskSubtitle from '../TaskSubtitle'
import LabelColors from './LabelColors'
import LabelsAvailable from './LabelsAvailable'

const schema = yup.object().shape({
  labelName: yup.string().min(2).required(),
  labelColor: yup.string().required(),
})

type LabelsDropdownProps = {
  id: number
}

const LabelsDropdown = ({ id }: LabelsDropdownProps) => {
  // Global state
  const board = useRecoilValue(boardState)
  const setLabels = useSetRecoilState(labelsState)
  const addLabelToTask = useSetRecoilState(taskLabelsState(id))
  // const setTask = useSetRecoilState(taskState(id))

  // Local state
  const [labelName, setLabelName] = useState<string>('')
  const [labelColor, setLabelColor] = useState<string | null>(null)
  const [errors, setErrors] = useState<yup.ValidationError | null>(null)

  const addLabel = async () => {
    setErrors(null)
    try {
      await schema.validate({
        labelName,
        labelColor,
      })

      const res = await client.post('/labels', {
        name: labelName,
        color: labelColor,
        board_id: board!.id,
      })

      await client.post(`/tasks/${id}/labels`, {
        task_id: id,
        label_id: res.data.data.id,
      })

      setLabels((old: LabelType[]) => {
        const copy = [...old]
        return copy.concat(res.data.data)
      })
      // setTask((old: TaskType | undefined) => {
      //   if (old) {
      //     return {
      //       ...old,
      //       labels: old?.labels.concat(res.data.data),
      //     }
      //   }
      //   return old
      // })
      addLabelToTask((labels: LabelType[] | undefined) => {
        return labels?.concat(res.data.data)
      })
      setLabelName('')
      setLabelColor(null)
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        setErrors(e)
      }
      console.log('addLabel error', e)
    }
    // Add to the labels
    // Assign to the task
  }

  return (
    <BaseDropdown>
      {(onTrigger, show) => (
        <>
          <Button
            className="w-full mt-3"
            onClick={() => onTrigger()}
            variant="default"
            alignment="left"
            icon={<MdLabel />}
            text="Labels"
          />
          {show && (
            <div className="absolute w-list top-0 left-0 md:left-auto bg-white rounded-card shadow-lg md:mt-12 py-3 px-4 z-10 border border-gray-border">
              <h3 className="font-semibold mb-2">Label</h3>
              <p className="text-sm text-gray3 mb-4">
                Select a name and a color
              </p>
              <input
                className="rounded-lg shadow-lg h-10 p-2 w-full border border-gray4 text-sm"
                type="text"
                placeholder="Label..."
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
              {errors && errors.path === 'labelName' && (
                <em className="text-danger text-xs">{errors.message}</em>
              )}

              <LabelColors selectColor={setLabelColor} />
              {errors && errors.path === 'labelColor' && (
                <div className="text-danger text-xs mb-4">
                  You should select a color
                </div>
              )}

              <TaskSubtitle
                icon={<MdLabel />}
                text="Available"
                className="mb-1"
              />
              <LabelsAvailable id={id} />

              <div className="w-full flex justify-center">
                <Button text="Add" variant="primary" onClick={addLabel} />
              </div>
            </div>
          )}
        </>
      )}
    </BaseDropdown>
  )
}

export default React.memo(LabelsDropdown)
