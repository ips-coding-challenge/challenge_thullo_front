import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { labelsState } from '../../../../state/labelState'
import { labelsAssignedState, taskState } from '../../../../state/taskState'
import { LabelType } from '../../../../types/types'
import Label from './Label'

type LabelsAvailableProps = {
  id: number
}

const LabelsAvailable = ({ id }: LabelsAvailableProps) => {
  const labelsAssigned = useRecoilValue(labelsAssignedState(id))
  const labels = useRecoilValue(labelsState)

  const [available, setAvailable] = useState<LabelType[]>(labels)

  const filter = () => {
    console.log('labels', labels)
    console.log('labelsAssigned', labelsAssigned)
    if (labelsAssigned && labelsAssigned.length > 0) {
      const filtered = labels.filter((l: LabelType) => {
        return (
          labelsAssigned?.findIndex((la: LabelType) => la.id === l.id) === -1
        )
      })
      console.log('filtered', filtered)
      setAvailable(filtered)
    }
  }

  useEffect(() => {
    filter()
  }, [labelsAssigned])

  return (
    <div className="flex mb-4 gap-2 flex-wrap">
      {available.map((label: LabelType) => (
        <Label can={true} key={label.id} label={label} />
      ))}
    </div>
  )
}

export default LabelsAvailable
