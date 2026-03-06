// Created: 2026-03-06 16:14
import Link from 'next/link'
import { Post } from '@/lib/supabase/database.types'
import DeletePostButton from '@/components/DeletePostButton'

interface PostCardProps {
  post: Post & {
    comments: { count: number }[]
    reactions: { count: number }[]
  }
  currentUserId?: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const commentCount = post.comments?.[0]?.count ?? 0
  const reactionCount = post.reactions?.[0]?.count ?? 0
  const isAuthor = !!currentUserId && currentUserId === post.user_id
  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <Link href={`/posts/${post.id}`} className="block p-4 pr-20">
        <h3 className="font-medium text-gray-900 hover:text-orange-500 transition-colors mb-1 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {post.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-medium text-gray-500">
            {post.profiles?.username}
          </span>
          <span>{date}</span>
          <span>👁 {post.views}</span>
          <span>💬 {commentCount}</span>
          <span>👍 {reactionCount}</span>
        </div>
      </Link>
      {isAuthor && (
        <div className="absolute top-3 right-3 flex gap-1">
          <Link
            href={`/posts/${post.id}/edit`}
            className="text-xs text-gray-400 hover:text-orange-500 px-2 py-1 rounded hover:bg-gray-50"
          >
            수정
          </Link>
          <DeletePostButton postId={post.id} />
        </div>
      )}
    </div>
  )
}
