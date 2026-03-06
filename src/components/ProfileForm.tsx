// Created: 2026-03-06 16:14
'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'

interface Props {
  initialUsername: string
  initialBio: string
}

export default function ProfileForm({ initialUsername, initialBio }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const result = await updateProfile(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
        <input
          name="username"
          type="text"
          defaultValue={initialUsername}
          required
          minLength={2}
          maxLength={20}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
        <textarea
          name="bio"
          defaultValue={initialBio}
          rows={3}
          maxLength={200}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          placeholder="자기소개를 입력하세요 (선택)"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded">
          프로필이 업데이트됐습니다!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
