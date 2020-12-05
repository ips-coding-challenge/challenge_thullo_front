import axios from 'axios'
import { nanoid } from 'nanoid'
import React, { useRef } from 'react'
import { MdAdd } from 'react-icons/md'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import {
  filesState,
  uploadErrorForTask,
  uploadErrorGeneralState,
  uploadErrorsState,
} from '../../state/fileState'
import { taskModalShowState, taskState } from '../../state/taskState'
import { FileType, TaskType, UploadError } from '../../types/types'

const FileInput = () => {
  const setFilesState = useSetRecoilState(filesState)
  const taskId = useRecoilValue(taskModalShowState).task_id
  const setTask = useSetRecoilState(taskState(taskId!))
  const setUploadError = useSetRecoilState(uploadErrorsState)
  // Used to reset error for a task when adding a new attachment
  const setUploadTaskError = useSetRecoilState(uploadErrorForTask(taskId!))
  const inputFileRef = useRef<HTMLInputElement>(null)
  // Allow to display an error for example if there is too much file uploaded at once
  // Or ( TODO ) limit the file format allowed to be uploaded
  const setUploadErrorGeneral = useSetRecoilState(uploadErrorGeneralState)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadTaskError((old) => old)
    uploadFiles(e.target.files)
    e.target.value = ''
  }

  const createFormData = (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET!
    )
    formData.append('folder', 'thullo')
    formData.append('multiple', 'true')
    return formData
  }

  const isValid = (files: FileList): boolean => {
    let isValid = true

    if (files?.length > 2) {
      setUploadErrorGeneral((old) => {
        return old.concat('You can only upload 2 files at the same time')
      })
      isValid = false
    }
    for (const f of Array.from(files)) {
      if (Math.round(f.size / 1024 / 1024) > 5) {
        setUploadErrorGeneral((old) => {
          return old.concat('You can only upload file which are less than 5mb')
        })
        isValid = false
      }
    }

    return isValid
  }

  const uploadFiles = async (files: FileList | null) => {
    setUploadErrorGeneral([])
    if (files) {
      // Validate file size and number
      if (!isValid(files)) {
        return
      }

      try {
        let requests: any[] = []

        for (const file of Array.from(files)) {
          const fileId = nanoid()
          setFilesState((old: FileType[]) => {
            return old.concat({
              id: fileId,
              name: file.name,
              progress: 0,
              finished: false,
              task_id: taskId!,
            })
          })
          const formData = createFormData(file)
          const sendRequest = axios.post(
            process.env.REACT_APP_CLOUDINARY_URL!,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (e: ProgressEvent<EventTarget>) => {
                setFilesState((old) => {
                  const index = old.findIndex(
                    (el: FileType) => el.id === fileId
                  )
                  if (index > -1) {
                    const updated = [...old]
                    updated[index] = {
                      ...updated[index],
                      progress: Math.floor((e.loaded / e.total) * 100),
                    }
                    return updated
                  } else {
                    return old.concat({
                      id: fileId,
                      name: file.name,
                      progress: Math.floor(e.loaded / e.total / 100),
                      finished: false,
                      task_id: taskId!,
                    })
                  }
                })
              },
              onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
                setFilesState((old: FileType[]) => {
                  const index = old.findIndex((el: any) => el.id === fileId)
                  console.log('index', index)
                  if (index > -1) {
                    const copy = [...old]
                    copy.splice(index, 1)
                    return copy
                  }
                  return old
                })
              },
            }
          )

          requests.push(sendRequest)
        }

        const responses = await axios.all(requests)
        for (const res of responses) {
          console.log('res', res)
          const attachment = {
            name: res.data.original_filename + '_' + nanoid(),
            format: res.data.format,
            public_id: res.data.public_id,
            url: res.data.secure_url,
            task_id: taskId,
          }
          try {
            const response = await client.post('/attachments', attachment)
            setTask((old: TaskType | undefined) => {
              if (old) {
                const attachments = old.attachments || []
                return {
                  ...old,
                  attachments: attachments.concat(response.data.data),
                }
              }
              return old
            })
          } catch (e) {
            setUploadError((old: UploadError[]) => {
              const uploadError: UploadError = {
                task_id: taskId!,
                filename: res.data.original_filename,
                message: e.message,
              }

              return old.concat(uploadError)
            })
            console.log('e', e)
          }
        }
      } catch (e) {
        console.log('Error', e)
        // setErrors(e.message)
      }
    }
  }

  return (
    <label
      className="bg-white border border-gray3 text-gray3 hover:bg-gray5 px-2 py-1 rounded-lg cursor-pointer"
      htmlFor="file"
    >
      <div className="flex items-center">
        <MdAdd className="mr-2" />
        <span className="text-xs font-semibold">Add</span>
      </div>
      <input
        ref={inputFileRef}
        className="hidden"
        type="file"
        id="file"
        onChange={onInputChange}
        multiple
      />
    </label>
  )
}

export default FileInput
