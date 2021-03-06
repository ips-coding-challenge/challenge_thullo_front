import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdEmail, MdLock } from 'react-icons/md'
import { Link, useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import * as yup from 'yup'
import client from '../api/client'
import GithubLink from '../components/Common/GithubLink'
import Input from '../components/Form/Input'
import LoadingButton from '../components/LoadingButton'
import { userState } from '../state/userState'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const Login = () => {
  const history = useHistory()
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const setUserState = useSetRecoilState(userState)

  const [loading, setLoading] = useState<boolean>(false)
  const [serverErrors, setServerErrors] = useState<any>(null)

  const login = async (formData: any) => {
    setLoading(true)
    try {
      const res = await client.post('/login', formData)
      console.log('login res', res.data)
      const { data } = res.data
      localStorage.setItem('token', data.token)
      setUserState(data.user)
      history.push('/')
    } catch (e) {
      console.log('login error', e.response)
      if (e.response && e.response.data) {
        setServerErrors({ message: e.response.data })
      } else {
        setServerErrors({ message: e.message })
      }
      setLoading(false)
    }
  }
  return (
    <div className="container flex flex-col justify-center items-center h-screen mx-auto px-6">
      <h1 className="text-3xl">Login</h1>
      <GithubLink />

      <form className="w-full md:w-container" onSubmit={handleSubmit(login)}>
        {serverErrors && (
          <p className="text-red-500 mb-4">{serverErrors.message}</p>
        )}
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          icon={<MdEmail />}
          ref={register}
          error={errors.email?.message}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          icon={<MdLock />}
          ref={register}
          error={errors.password?.message}
          required
        />

        <div className="my-2 text-sm">
          <p>Don't want to create an account?</p>
          <p className="text-blue">
            Try <strong>demo@test.com</strong> with <strong>password</strong>
          </p>
        </div>

        <p className="text-gray-600 mb-4 text-right hover:text-gray-800">
          <Link to="/register">Not registered yet?</Link>
        </p>

        <LoadingButton text="Login" type="submit" loading={loading} />
      </form>
    </div>
  )
}

export default Login
