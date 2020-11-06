import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

type SearchInputProps = {
  className?: string
}

const SearchInput = ({ className }: SearchInputProps) => {
  const [query, setQuery] = useState('')

  return (
    <div
      className={`rounded-lg shadow-md h-10 flex justify-between items-center p-1 ${className}`}
    >
      <input
        style={{ minWidth: 0 }}
        className="mx-2"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Keyword..."
      />
      <button className="bg-blue rounded-lg h-full px-4 text-white text-sm">
        <MdSearch />
      </button>
    </div>
  )
}

export default SearchInput
