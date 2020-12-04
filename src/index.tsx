import React from 'react'
import ReactDOM from 'react-dom'
import 'fontsource-noto-sans'
import './styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.min.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import reportWebVitals from './reportWebVitals'
import { ToastContainer } from 'react-toastify'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RecoilRoot>
        <App />
        <ToastContainer autoClose={1500} position="top-left" limit={3} />
      </RecoilRoot>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
