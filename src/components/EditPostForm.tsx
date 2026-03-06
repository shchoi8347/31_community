// Created: 2026-03-06 16:14
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePost } from '@/app/actions/posts'

interface Props {
  postId: string
  initialTitle: string
  initialContent: string
}

export default function EditPostForm({ postId, initialTitle, initialContent }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await updatePost(postId, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          name="title"
          type="text"
          defaultValue={initialTitle}
          required
          maxLength={200}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
        <textarea
          name="content"
          defaultValue={initialContent}
          required
          rows={12}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
