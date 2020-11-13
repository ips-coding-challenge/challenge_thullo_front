import React, { useEffect, useRef, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listState } from '../../state/listState'
import { ListOfTasks, TaskType } from '../../types/types'
import ListInput from './ListInput'
import Task from '../Tasks/Task'
import AddButton from './AddButton'
import { newTaskState } from '../../state/taskState'
import { Draggable, Droppable } from 'react-beautiful-dnd'

type ListProps = {
  board_id: number
  list: ListOfTasks
}

const List = ({ board_id, list }: ListProps) => {
  const [newTask, setNewTask] = useRecoilState<TaskType | null>(newTaskState)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const setLists = useSetRecoilState(listState)

  useEffect(() => {
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [menuRef])

  const onClickOutside = (e: any) => {
    if (menuRef && !menuRef.current?.contains(e.target)) {
      setShowMenu(false)
    }
  }

  const deleteList = async () => {
    try {
      await client.delete(`/lists/${list.id}`, {
        data: {
          board_id: list.board_id,
        },
      })

      setLists((old: ListOfTasks[]) => {
        const index = old.findIndex((el: ListOfTasks) => el.id === list.id)
        if (index > -1) {
          const copy = [...old]

          copy.splice(index, 1)
          return copy
        } else {
          return old
        }
      })
    } catch (e) {
      console.log('Delete list error', e)
    }
  }

  const addTask = () => {
    // If I already have a task waiting to be created I just return
    if (newTask) {
      return
    }
    // Need the list_id and the last task in the list
    const taskToAdd: TaskType = {
      id: null,
      title: '',
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
  }

  const onTaskSaved = (task: TaskType, action: string) => {
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
            (t) => t.id === newTask!.id
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
  }

  return (
    <div className="relative flex flex-col w-list items-center">
      {edit ? (
        <ListInput board_id={board_id} list={list} setEdit={setEdit} />
      ) : (
        <>
          <div className="flex justify-between w-full items-center mb-4">
            <h3>{list.name}</h3>
            <MdMoreHoriz
              onClick={() => {
                setShowMenu(true)
              }}
              className="cursor-pointer hover:text-blue transition-colors duration-300"
            />
          </div>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-0 right-0 bg-white rounded-lg shadow-lg mt-6 py-3 px-4 z-10"
            >
              <div
                onClick={() => setEdit(true)}
                className="cursor-pointer text-gray2 hover:text-black duration-300 transition-colors"
              >
                Edit
              </div>
              <div
                onClick={deleteList}
                className="cursor-pointer text-danger hover:text-red-700 duration-300 transition-colors"
              >
                Delete
              </div>
            </div>
          )}
        </>
      )}

      {/* List of tasks */}
      <div className="w-full h-auto">
        <Droppable key={list.id} droppableId={`${list.id}`}>
          {(provided, snapshot) => (
            <div
              style={{ minHeight: '50px' }}
              className={`${snapshot.isDraggingOver ? 'bg-orange-100' : ''}`}
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
                        <Task onTaskSaved={onTaskSaved} task={task} />
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
