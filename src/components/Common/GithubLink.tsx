import React from 'react'
import { AiFillGithub } from 'react-icons/ai'

const GithubLink = () => {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_GITHUB_ID}`}
    >
      <AiFillGithub className="text-6xl text-black hover:text-yellow-500 transition-colors duration-300 cursor-pointer my-4" />
    </a>
  )
}

export default GithubLink
