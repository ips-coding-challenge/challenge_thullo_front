import React, { useEffect, useRef, useState } from 'react'
import { MdAdd, MdMoreHoriz } from 'react-icons/md'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listState } from '../../state/listState'
import { ListOfTasks, TaskType } from '../../types/types'
import ListInput from './ListInput'
import Task from '../Tasks/Task'
import { nanoid } from 'nanoid'
import AddButton from './AddButton'
import { newTaskState } from '../../state/taskState'

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
  const [fakeTasks, setFakeTasks] = useState<TaskType[]>([
    {
      id: 1,
      title: 'First task',
      board_id: 1,
      list_id: 1,
      position: 65565,
    },
    {
      id: 2,
      title: 'Second task',
      board_id: 1,
      list_id: 1,
      position: 65565 * 2,
    },
  ])

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
    if (fakeTasks.findIndex((t) => t.id === null) > -1) {
      return
    }
    console.log('in here')
    // Need the list_id and the last task in the list
    const newTask: TaskType = {
      id: null,
      title: '',
      position: fakeTasks[fakeTasks.length - 1].position,
      list_id: list.id,
      board_id: list.board_id,
    }

    setNewTask((oldTask: any) => {
      if (oldTask !== newTask) {
        return newTask
      }
      return oldTask
    })

    // setFakeTasks((old: TaskType[]) => {
    //   return old.concat(newTask)
    // })
  }

  const onTaskSaved = (task: TaskType, action: string) => {
    if (action === 'create') {
      setFakeTasks((old: TaskType[]) => {
        const index = old.findIndex((t) => t.id === null)
        if (index > -1) {
          const copy = [...old]
          copy[index] = task
          return copy
        }
        return old
      })
    }
    console.log('task saved', task)
  }

  return (
    <div className="relative flex flex-col w-list justify-between items-center">
      {edit ? (
        <ListInput board_id={board_id} list={list} setEdit={setEdit} />
      ) : (
        <>
          <div className="flex justify-between w-full items-center">
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
      <div className="w-full h-full">
        {fakeTasks.map((task: TaskType, index: number) => {
          return (
            <Task
              onTaskSaved={onTaskSaved}
              key={task.id || nanoid()}
              task={task}
            />
          )
        })}

        {/* Add another task */}
        {newTask && newTask.list_id === list.id && (
          <Task onTaskSaved={onTaskSaved} task={newTask} />
        )}

        <AddButton
          onClick={addTask}
          text="Add another task"
          icon={<MdAdd />}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default React.memo(List)
