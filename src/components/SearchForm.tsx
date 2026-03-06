// Created: 2026-03-06 16:14
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  initialQuery: string
}

export default function SearchForm({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요 (제목, 내용)"
        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
      >
        검색
      </button>
    </form>
  )
}
