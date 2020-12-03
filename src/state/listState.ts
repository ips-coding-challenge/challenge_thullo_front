import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import { LabelType, ListOfTasks, TaskType } from '../types/types'
import { taskLabelsState } from './labelState'
import { labelsAssignedState } from './taskState'

// SearchQuery
export const queryState = atom<string>({
  key: 'searchQuery',
  default: '',
})

export const listState = atom<ListOfTasks[]>({
  key: 'list',
  default: [],
})

export const listFilteredState = selector<ListOfTasks[]>({
  key: 'listFiltered',
  get: ({ get }) => {
    console.log('called')
    const query = get(queryState)
    if (query === '') return get(listState)
    const lists = get(listState)

    let newLists: ListOfTasks[] = []

    lists.forEach((el: ListOfTasks) => {
      let toReturn: Set<TaskType> = new Set()
      el.tasks.forEach((t: TaskType) => {
        const labels = get(taskLabelsState(t.id!))
        if (t.title.toLowerCase().includes(query.toLowerCase())) {
          toReturn.add(t)
        }
        labels?.filter((l: LabelType) => {
          if (l.name.toLowerCase().includes(query.toLowerCase())) {
            toReturn.add(t)
          }
        })
      })

      newLists.push({ ...el, tasks: Array.from(toReturn) })
    })
    return newLists
  },
})

export const listItemState = atomFamily({
  key: 'listItem',
  default: (list: any) => (list ? list : null),
})

export const currentListState = selectorFamily({
  key: 'currentList',
  get: (id) => ({ get }) => {
    return get(listFilteredState).find((list: ListOfTasks) => list.id === id)
  },
  set: (id) => ({ get, set }, value: any) => {
    set(currentListState(id), value)
  },
})

// Ok but need more refactoring
// export const currentListState = atomFamily({
//   key: 'currentList',
//   default: selectorFamily({
//     key: 'currentListItem',
//     get: (id) => ({ get }) => {
//       return get(listState).find((l: ListOfTasks) => l.id === id)
//     },
//   }),
// })
