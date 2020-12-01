import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { DebounceInput } from 'react-debounce-input'

type SearchInputProps = {
  placeholder: string
  search: (query: string) => void
  className?: string
  debounceTimeout?: number
}

const SearchInput = ({
  placeholder,
  search,
  className,
  debounceTimeout = 100,
}: SearchInputProps) => {
  const [query, setQuery] = useState('')

  return (
    <div
      className={`rounded-lg shadow-md h-10 flex justify-between items-center p-1 ${className}`}
    >
      <DebounceInput
        style={{ minWidth: 0 }}
        className="mx-2"
        minLength={2}
        placeholder={placeholder}
        debounceTimeout={debounceTimeout}
        onChange={(e) => {
          setQuery(e.target.value)
          search(e.target.value)
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
