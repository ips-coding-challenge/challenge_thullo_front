import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

type SearchInputProps = {
  placeholder: string
  search: (query: string) => void
  className?: string
}

const SearchInput = ({ placeholder, search, className }: SearchInputProps) => {
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
        placeholder={placeholder}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            search(query)
          }
        }}
      />
      <button
        className="bg-blue rounded-lg h-full px-4 hover:bg-blue-darker text-white text-sm"
        onClick={() => search(query)}
      >
        <MdSearch />
      </button>
    </div>
  )
}

export default SearchInput
