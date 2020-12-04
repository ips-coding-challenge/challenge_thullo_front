import React, { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Boards from './pages/Boards'
import Login from './pages/Login'
import Register from './pages/Register'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from './state/userState'
import client from './api/client'
import BasicLoader from './components/BasicLoader'
import SingleBoard from './pages/SingleBoard'
import Invitations from './pages/Invitations'
import Profile from './pages/Profile'
import { toast } from 'react-toastify'

function App() {
  const history = useHistory()
  const location = useLocation()
  const setUser = useSetRecoilState(userState)
  const [init, setInit] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (location.search.length > 0) {
      const access_token = new URLSearchParams(location.search).get(
        'access_token'
      )

      const githubError = new URLSearchParams(location.search).get('error')
      if (githubError) {
        toast.error(githubError)
        history.push('/login')
        setInit(false)
        return
      }

      if (access_token) {
        // Connect the user
        localStorage.setItem('token', access_token)
        history.replace({
          search: '',
        })
        fetchUser()
      }
    }
  }, [location.search])

  const fetchUser = useCallback(async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await client.get('/me')
        setUser(res.data.data)
      } catch (e) {
        console.log('e', e)
        if (e.status === 401) {
          localStorage.removeItem('token')
          history.push('/login')
        }
      } finally {
        setInit(false)
      }
    } else {
      setInit(false)
    }
  }, [])

  useEffect(() => {
    if (location.search === '') {
      fetchUser()
    }
  }, [])

  if (init) {
    return (
      <div className="h-screen w-full">
        <BasicLoader />
      </div>
    )
  }
  return (
    <Switch>
      <PublicRoute path="/login">
        <Login />
      </PublicRoute>
      <PublicRoute path="/register">
        <Register />
      </PublicRoute>
      <PrivateRoute exact path="/boards/:id">
        <SingleBoard />
      </PrivateRoute>
      <PrivateRoute exact path="/invitations">
        <Invitations />
      </PrivateRoute>
      <PrivateRoute exact path="/profile">
        <Profile />
      </PrivateRoute>
      <PrivateRoute exact path="/">
        <Boards />
      </PrivateRoute>
    </Switch>
  )
}

export default App
