import axios, { AxiosResponse } from 'axios'
import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Button from '../components/Common/Button'
import Avatar from '../components/Header/Avatar'
import Navbar from '../components/Header/Navbar'
import { useMutate } from '../hooks/useMutate'
import { useUploadFile } from '../hooks/useUploadFile'
import { userState } from '../state/userState'
import { User } from '../types/types'

const Profile = () => {
  const [user, setUser] = useRecoilState(userState)

  const { loading, errors: mutateErrors, result, mutate } = useMutate(
    '/users',
    'PUT'
  )

  const { uploadFiles, errors, isUploading } = useUploadFile({
    folder: 'avatar',
    beforeUpload: (file) => {
      console.log(
        'beforeUpload called... setState in here if we need to keep track'
      )
    },
    onUploadProgress: (e, f) => {
      console.log('onUploadProgress called')
    },
    onUploadFinished: (e, f) => {
      console.log('onUploadFinshed called')
    },
    handleResponses: async (responses: AxiosResponse<any>[]) => {
      console.log('responses', responses)
      for (const res of responses) {
        console.log('res', res.data)
        await mutate({
          id: 1,
          avatar: res.data.secure_url,
        })
        setUser((user: User | null) => {
          if (!user) return user

          return { ...user, avatar: res.data.secure_url }
        })
      }
      // setIsUploading(false)
    },
  })

  useEffect(() => {
    console.log('isUploading', isUploading)
  }, [isUploading])
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="container mx-auto mt-6 p-8">
        <h1 className="text-2xl mb-4">Profile</h1>
        <hr />
        {loading && <div>Loading....</div>}
        {mutateErrors && mutateErrors.map((e: any) => <div>{e.message}</div>)}
        <div className="flex flex-col mt-8 w-list mx-auto items-center justify-center">
          {user?.avatar ? (
            <img
              className="w-40 h-40 bg-gray1 flex items-center justify-center rounded-lg object-cover"
              src={user?.avatar}
              alt="user avatar"
            />
          ) : (
            <Avatar
              width="w-40"
              height="h-40"
              textSize="text-4xl"
              username={user?.username!}
            />
          )}
          {!isUploading && (
            <label htmlFor="file" className="flex">
              <div className="bg-gray1 hover:bg-gray5 text-gray3 rounded-lg cursor-pointer px-3 py-2 mt-2">
                Change avatar
              </div>
              <input
                id="file"
                name="avatar"
                className="hidden"
                type="file"
                onChange={uploadFiles}
                multiple={true}
              />
            </label>
          )}
          <hr className="my-4 w-full" />
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg mb-4">{user?.username}</div>
            <div className="text-lg mb-4">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
