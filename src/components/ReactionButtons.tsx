// Created: 2026-03-06 16:14
'use client'

import { toggleReaction } from '@/app/actions/comments'
import { useTransition } from 'react'

interface Props {
  postId: string
  likeCount: number
  dislikeCount: number
  userReaction: string | null
  isLoggedIn: boolean
}

export default function ReactionButtons({ postId, likeCount, dislikeCount, userReaction, isLoggedIn }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleReaction(type: 'like' | 'dislike') {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.')
      return
    }
    startTransition(() => toggleReaction(postId, type))
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleReaction('like')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          userReaction === 'like'
            ? 'bg-orange-500 text-white border-orange-500'
            : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500'
        } disabled:opacity-50`}
      >
        👍 좋아요 {likeCount}
      </button>
      <button
        onClick={() => handleReaction('dislike')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          userReaction === 'dislike'
            ? 'bg-gray-700 text-white border-gray-700'
            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-700'
        } disabled:opacity-50`}
      >
        👎 싫어요 {dislikeCount}
      </button>
    </div>
  )
}
