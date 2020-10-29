import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Boards from './pages/Boards'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Boards />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
