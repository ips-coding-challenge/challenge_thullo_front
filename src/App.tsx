import React, { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
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

function App() {
  const history = useHistory()
  const setUser = useSetRecoilState(userState)
  const [init, setInit] = useState(true)

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
    fetchUser()
  }, [])

  if (init) {
    return (
      <div className="h-screen w-full">
        <BasicLoader />
      </div>
    )
  }
  return (
    <Router>
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
    </Router>
  )
}

export default App
