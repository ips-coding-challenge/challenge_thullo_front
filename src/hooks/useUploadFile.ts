import axios, { AxiosResponse } from 'axios'
import { nanoid } from 'nanoid'
import { useState } from 'react'

interface useUploadFileProps {
  folder?: string
  beforeUpload: (f: File) => void
  onUploadProgress: (e: ProgressEvent<EventTarget>, f: File) => void
  onUploadFinished: (e: ProgressEvent<EventTarget>, f: File) => void
  handleResponses: (r: AxiosResponse<any>[]) => Promise<void>
}

export const useUploadFile = ({
  folder = 'thullo',
  beforeUpload,
  onUploadProgress,
  onUploadFinished,
  handleResponses,
}: useUploadFileProps) => {
  // const [requests, setRequests] = useState<Promise<AxiosResponse<any>>[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const createFormData = (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET!
    )
    formData.append('folder', folder)
    formData.append('multiple', 'true')
    return formData
  }

  const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([])
    setIsUploading(true)
    const files = e.target.files
    if (!files) return
    console.log('uploadFiles', files)
    if (files) {
      try {
        let requests: any[] = []

        for (const file of Array.from(files)) {
          beforeUpload(file)
          // setFilesState((old: FileType[]) => {
          //   return old.concat({
          //     id: fileId,
          //     name: file.name,
          //     progress: 0,
          //     finished: false,
          //     task_id: taskId!,
          //   })
          // })
          const formData = createFormData(file)
          const sendRequest = axios.post(
            process.env.REACT_APP_CLOUDINARY_URL!,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (e: ProgressEvent<EventTarget>) => {
                onUploadProgress(e, file)
                // setFilesState((old) => {
                //   const index = old.findIndex(
                //     (el: FileType) => el.id === fileId
                //   )
                //   if (index > -1) {
                //     const updated = [...old]
                //     updated[index] = {
                //       ...updated[index],
                //       progress: Math.floor((e.loaded / e.total) * 100),
                //     }
                //     return updated
                //   } else {
                //     return old.concat({
                //       id: fileId,
                //       name: file.name,
                //       progress: Math.floor(e.loaded / e.total / 100),
                //       finished: false,
                //       task_id: taskId!,
                //     })
                //   }
                // })
              },
              onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
                onUploadFinished(e, file)
                setIsUploading(false)
                // setFilesState((old: FileType[]) => {
                //   const index = old.findIndex((el: any) => el.id === fileId)
                //   console.log('index', index)
                //   if (index > -1) {
                //     const copy = [...old]
                //     copy.splice(index, 1)
                //     return copy
                //   }
                //   return old
                // })
              },
            }
          )

          // requests.push(sendRequest)
          // setRequests((old: any) => old.concat(sendRequest))
          requests.push(sendRequest)
        }

        const responses = await axios.all(requests)
        handleResponses(responses)
        // const responses = await axios.all(requests)
        // for (const res of responses) {
        //   console.log('res', res)
        //   const attachment = {
        //     name: res.data.original_filename + '_' + nanoid(),
        //     format: res.data.format,
        //     public_id: res.data.public_id,
        //     url: res.data.secure_url,
        //     task_id: taskId,
        //   }
        //   try {
        //     const response = await client.post('/attachments', attachment)
        //     setTask((old: TaskType | undefined) => {
        //       if (old) {
        //         const attachments = old.attachments || []
        //         return {
        //           ...old,
        //           attachments: attachments.concat(response.data.data),
        //         }
        //       }
        //       return old
        //     })
        //   } catch (e) {
        //     setUploadError((old: UploadError[]) => {
        //       const uploadError: UploadError = {
        //         task_id: taskId!,
        //         filename: res.data.original_filename,
        //         message: e.message,
        //       }

        //       return old.concat(uploadError)
        //     })
        //     console.log('e', e)
        //   }
        // }
      } catch (e) {
        console.log('Error', e)
        setErrors((errors) => errors.concat(e))
        setIsUploading(false)
        // setErrors(e.message)
      }
    }
  }

  return { uploadFiles, errors, isUploading, setIsUploading }
}
