import React, { useState } from 'react'

const SearchInput = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="rounded-lg shadow-md h-10 flex justify-between items-center p-1">
      <input
        className="mx-2"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Keyword..."
      />
      <button className="bg-blue rounded-lg h-full px-4 text-white text-sm">
        Search
      </button>
    </div>
  )
}

export default SearchInput
