// Created: 2026-03-06 16:14
'use client'

import { useState, useTransition } from 'react'
import { createComment, deleteComment } from '@/app/actions/comments'
import { Comment } from '@/lib/supabase/database.types'

interface Props {
  postId: string
  comments: Comment[]
  currentUserId: string | null
}

export default function CommentSection({ postId, comments, currentUserId }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      return
    }
    startTransition(async () => {
      const result = await createComment(postId, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-700 mb-4">댓글 {comments.length}개</h2>

      {/* 댓글 목록 */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">첫 번째 댓글을 남겨보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {(comment as any).profiles?.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString('ko-KR', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => startTransition(() => deleteComment(comment.id, postId))}
                    className="text-xs text-red-400 hover:text-red-600 ml-2 shrink-0"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 */}
      <form action={handleSubmit} className="space-y-2">
        <textarea
          name="content"
          rows={3}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          placeholder={currentUserId ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
          disabled={!currentUserId}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!currentUserId || isPending}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? '등록 중...' : '댓글 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
