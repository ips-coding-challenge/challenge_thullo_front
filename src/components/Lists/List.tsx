import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listState } from '../../state/listState'
import { ListOfTasks, TaskType } from '../../types/types'
import ListInput from './ListInput'
import Task from '../Tasks/Task'
import AddButton from './AddButton'
import {
  newTaskState,
  taskModalShowState,
  tasksState,
} from '../../state/taskState'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import ListDropdown from './ListDropdown'
import ListHeading from './ListHeading'

type ListProps = {
  board_id: number
  list: ListOfTasks
}

const List = ({ board_id, list }: ListProps) => {
  const setTasks = useSetRecoilState(tasksState)
  const [newTask, setNewTask] = useRecoilState<TaskType | null>(newTaskState)
  const setLists = useSetRecoilState(listState)

  const addTask = useCallback(() => {
    // If I already have a task waiting to be created I just return
    if (newTask) {
      return
    }
    // Need the list_id and the last task in the list
    const taskToAdd: TaskType = {
      id: null,
      title: '',
      description: null,
      labels: [],
      position:
        list.tasks.length > 0
          ? list.tasks[list.tasks.length - 1].position + 65565
          : 65565,
      list_id: list.id,
      board_id: list.board_id,
    }

    setNewTask((oldTask: any) => {
      if (oldTask !== taskToAdd) {
        return taskToAdd
      }
      return oldTask
    })
  }, [])

  const onTaskSaved = useCallback((task: TaskType, action: string) => {
    setTasks((old: TaskType[]) => {
      return old.concat(task)
    })
    setLists((old: ListOfTasks[]) => {
      const listIndex = old.findIndex((l) => l.id === list.id)
      if (listIndex === -1) {
        return old
      }

      const copy = [...old]
      switch (action) {
        case 'create':
          copy[listIndex] = {
            ...copy[listIndex],
            tasks: copy[listIndex].tasks.concat(task),
          }
          return copy
        case 'update':
          const taskIndex = old[listIndex].tasks.findIndex(
            (t) => t.id === task!.id
          )
          if (taskIndex > -1) {
            const oldTasks = Array.from(old[listIndex].tasks)
            oldTasks[taskIndex] = task
            copy[listIndex] = { ...copy[listIndex], tasks: oldTasks }
            return copy
          }
          return old
        default:
          return old
      }
    })
    setNewTask(null)
    console.log('task saved', task)
  }, [])

  return (
    <div className="relative flex flex-col w-list items-center px-1 transition-all duration-300">
      <ListHeading board_id={board_id} list={list} />

      {/* List of tasks */}
      <div className="w-full h-auto p-1">
        <Droppable key={list.id} droppableId={`${list.id}`}>
          {(provided, snapshot) => (
            <div
              style={{ minHeight: '30px' }}
              className={` ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {list.tasks.map((task: TaskType, index: number) => {
                return (
                  <Draggable
                    key={task.id}
                    draggableId={`${task.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Task
                          onTaskSaved={onTaskSaved}
                          task={task}
                          snapshot={snapshot}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add another task */}
        {newTask && newTask.list_id === list.id && newTask.id === null && (
          <Task onTaskSaved={onTaskSaved} task={newTask} />
        )}
      </div>
      <AddButton
        onClick={addTask}
        text="Add another task"
        icon={<MdAdd />}
        className="flex-none w-full"
      />
    </div>
  )
}

export default React.memo(List)
