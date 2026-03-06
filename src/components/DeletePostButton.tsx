// Created: 2026-03-06 16:14
'use client'

import { deletePost } from '@/app/actions/posts'
import { useTransition } from 'react'

interface Props {
  postId: string
}

export default function DeletePostButton({ postId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('글을 삭제하시겠습니까?')) return
    startTransition(() => deletePost(postId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
