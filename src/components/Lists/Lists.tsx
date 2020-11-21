import React, { useCallback } from 'react'
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listState } from '../../state/listState'
import { Board, ListOfTasks, TaskType } from '../../types/types'
import AddList from './AddList'
import List from './List'

type ListsProps = {
  board: Board
}

type InitialData = {
  sourceTasks: TaskType[]
  source: DraggableLocation
  destination: DraggableLocation
  destTasks?: TaskType[]
}

const Lists = ({ board }: ListsProps) => {
  const [lists, setLists] = useRecoilState(listState)

  console.log('lists', lists)

  const reorder = useCallback(
    async (
      source: DraggableLocation,
      destination: DraggableLocation,
      sourceTasks: TaskType[],
      sourceListIndex: number
    ) => {
      const initialData: InitialData = {
        sourceTasks: Array.from(sourceTasks),
        source,
        destination,
      }
      const [removed] = sourceTasks.splice(source.index, 1)
      const updatedTask = {
        ...removed,
        position: calculatePosition(destination.index, sourceTasks),
      }
      // console.log('updatedTask', updatedTask)
      sourceTasks.splice(destination.index, 0, updatedTask)

      setLists((old: ListOfTasks[]) => {
        const copy = [...old]
        copy[sourceListIndex] = { ...copy[sourceListIndex], tasks: sourceTasks }
        console.log('reorder', copy)
        return copy
      })

      await updateTask(updatedTask, +destination.droppableId, initialData)
    },
    []
  )

  const move = useCallback(
    async (
      source: DraggableLocation,
      destination: DraggableLocation,
      sourceTasks: TaskType[],
      destinationTasks: TaskType[],
      sourceListIndex: number,
      destListIndex: number
    ) => {
      const initialData: InitialData = {
        sourceTasks: Array.from(sourceTasks),
        destTasks: Array.from(destinationTasks),
        source,
        destination,
      }
      const [removed] = sourceTasks.splice(+source.index, 1)
      const updatedTask = {
        ...removed,
        list_id: +destination.droppableId,
        position: calculatePosition(destination.index, destinationTasks),
      }
      destinationTasks.splice(+destination.index, 0, updatedTask)

      setLists((old: ListOfTasks[]) => {
        const copy = [...old]
        copy[sourceListIndex] = { ...copy[sourceListIndex], tasks: sourceTasks }
        copy[destListIndex] = {
          ...copy[destListIndex],
          tasks: destinationTasks,
        }
        console.log('copy', copy)
        return copy
      })
      await updateTask(updatedTask, +destination.droppableId, initialData)
    },
    []
  )

  const calculatePosition = useCallback(
    (destIndex: number, destTasks: TaskType[]) => {
      if (destIndex === 0 && destTasks[destIndex]) {
        const position = destTasks[destIndex].position / 2
        return position
      }

      if (destIndex > 0) {
        // The task has a previous and a next task
        if (destTasks[destIndex + 1]) {
          const position =
            (destTasks[destIndex - 1].position +
              destTasks[destIndex].position) /
            2

          return position
        } else {
          // The task has only a previous task
          return destTasks[destIndex - 1].position + 65565
        }
      }

      return 65565
    },
    []
  )

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const sourceListIndex = lists.findIndex((l) => l.id === +source.droppableId)
    const destinationListIndex = lists.findIndex(
      (l) => l.id === +destination.droppableId
    )

    const sourceTasks = Array.from(lists[sourceListIndex].tasks)
    const destinationTasks = Array.from(lists[destinationListIndex].tasks)

    // Task moved into the same list at a different position
    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      // Reorder the tasks
      await reorder(source, destination, sourceTasks, sourceListIndex)
    }

    // Task moved from a list to another
    if (source.droppableId !== destination.droppableId) {
      await move(
        source,
        destination,
        sourceTasks,
        destinationTasks,
        sourceListIndex,
        destinationListIndex
      )
    }
  }

  const updateTask = useCallback(
    async (task: TaskType, listId: number, initialData: InitialData) => {
      try {
        const res = await client.put(`/tasks/${task.id}`, {
          title: task.title,
          position: task.position,
          board_id: task.board_id,
          list_id: listId ? listId : task.list_id,
        })

        console.log('updateTask res', res.data.data)
      } catch (e) {
        setLists((old: ListOfTasks[]) => {
          console.log('Updating task on drag end', e)
          console.log('InitialData', initialData)
          let copy = [...old]
          const { source, destination, sourceTasks, destTasks } = initialData
          if (destTasks) {
            const sourceListIndex = copy.findIndex(
              (l) => l.id === +source.droppableId
            )
            const destListIndex = copy.findIndex(
              (l) => l.id === +destination.droppableId
            )
            copy[sourceListIndex] = {
              ...copy[sourceListIndex],
              tasks: sourceTasks,
            }
            copy[destListIndex] = {
              ...copy[destListIndex],
              tasks: destTasks,
            }
          } else {
            const sourceListIndex = copy.findIndex(
              (l) => l.id === +source.droppableId
            )
            copy[sourceListIndex] = {
              ...copy[sourceListIndex],
              tasks: sourceTasks,
            }
          }
          return copy
        })
      }
    },
    []
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full h-full overflow-auto">
        <div className="grid grid-flow-col gap-6 auto-cols-list p-6">
          {lists.length > 0 &&
            lists.map((list: ListOfTasks) => {
              return <List key={list.id} board_id={board!.id} list={list} />
            })}
          <AddList board_id={board!.id} />
        </div>
      </div>
    </DragDropContext>
  )
}

export default React.memo(Lists)
