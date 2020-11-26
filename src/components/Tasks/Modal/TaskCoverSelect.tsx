import React, { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../../api/client'
import { boardState } from '../../../state/boardState'
import { taskState } from '../../../state/taskState'
import { selectedPhotoState } from '../../../state/unsplashState'
import { TaskType } from '../../../types/types'
import UnsplashDropdown from '../../Common/Unsplash/UnsplashDropdown'

type TaskCoverProps = {
  id: number
}

const TaskCoverSelect = ({ id }: TaskCoverProps) => {
  const board = useRecoilValue(boardState)
  const [selectedPhoto, setSelectedPhoto] = useRecoilState<any>(
    selectedPhotoState
  )
  const setTask = useSetRecoilState(taskState(id!))

  const saveCover = useCallback(async () => {
    if (!selectedPhoto) {
      return
    }

    const url = selectedPhoto.urls.regular
    try {
      const res = await client.patch(`/tasks/${id}`, {
        cover: url,
        board_id: board!.id,
      })
      console.log('res', res.data.data)
      setSelectedPhoto(null)
      setTask((old: TaskType | undefined) => {
        if (old) {
          return { ...old, cover: url }
        }
        return old
      })
    } catch (e) {
      console.log('e', e)
    }
  }, [selectedPhoto])

  useEffect(() => {
    console.log('selectedPhoto', selectedPhoto)
    if (selectedPhoto) {
      saveCover()
    }
  }, [selectedPhoto])
  return <UnsplashDropdown />
}

export default TaskCoverSelect
