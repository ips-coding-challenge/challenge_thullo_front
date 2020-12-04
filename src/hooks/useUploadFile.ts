import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'

interface useUploadFileProps {
  folder?: string
  beforeUpload: (f: File) => void
  onUploadProgress: (e: ProgressEvent<EventTarget>, f: File) => void
  onUploadFinished: (e: ProgressEvent<EventTarget>, f: File) => void
  handleResponses: (r: AxiosResponse<any>[]) => Promise<void>
  maxFiles?: number
  maxSize?: number
  fileFormat?: string[]
}

export const useUploadFile = ({
  folder = 'thullo',
  beforeUpload,
  onUploadProgress,
  onUploadFinished,
  handleResponses,
  maxFiles = 2,
  maxSize = 5,
  fileFormat = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/json',
    'text/javascript',
    'text/plain',
  ],
}: useUploadFileProps) => {
  const [errors, setErrors] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const validateFiles = (files: FileList) => {
    if (files.length > maxFiles) {
      throw new Error(`You cannot upload more than ${maxFiles} files`)
    }

    for (const f of Array.from(files)) {
      if (Math.round(f.size / 1024 / 1024) > maxSize) {
        throw new Error(`You cannot upload file larger than ${maxSize} mb`)
      }
      console.log('f', f)
      if (!fileFormat.includes(f.type)) {
        throw new Error(`Only those file are accepted: ${fileFormat}`)
      }
    }
  }

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
    if (files) {
      try {
        // validation
        validateFiles(files)
        let requests: any[] = []

        for (const file of Array.from(files)) {
          beforeUpload(file)
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
              },
              onDownloadProgress: (e: ProgressEvent<EventTarget>) => {
                onUploadFinished(e, file)
                setIsUploading(false)
              },
            }
          )

          requests.push(sendRequest)
        }

        const responses = await axios.all(requests)
        handleResponses(responses)
      } catch (e) {
        console.log('Error', e)
        setErrors((errors) => errors.concat(e))
        setIsUploading(false)
      }
    }
  }

  return { uploadFiles, errors, isUploading, setIsUploading }
}
