import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Boards from './pages/Boards'
import Login from './pages/Login'
import Register from './pages/Register'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userState } from './state/userState'
import client from './api/client'
import BasicLoader from './components/BasicLoader'

function App() {
  const [user, setUser] = useRecoilState(userState)
  const [init, setInit] = useState(true)

  const fetchUser = useCallback(async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await client.get('/me')
        console.log('res fetchUser', res.data)
        setUser(res.data.data)
      } catch (e) {
        console.log('e', e)
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
        <PrivateRoute exact path="/">
          <Boards />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App
