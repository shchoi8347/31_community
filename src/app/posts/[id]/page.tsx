// Created: 2026-03-06 16:14
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'
import ReactionButtons from '@/components/ReactionButtons'
import DeletePostButton from '@/components/DeletePostButton'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // 조회수 증가
  const { data: postData } = await supabase.from('posts').select('views').eq('id', id).single()
  if (postData) {
    await supabase.from('posts').update({ views: postData.views + 1 }).eq('id', id)
  }

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  const { data: reactions } = await supabase
    .from('reactions')
    .select('*')
    .eq('post_id', id)

  const { data: { user } } = await supabase.auth.getUser()

  const likeCount = reactions?.filter(r => r.type === 'like').length ?? 0
  const dislikeCount = reactions?.filter(r => r.type === 'dislike').length ?? 0
  const userReaction = reactions?.find(r => r.user_id === user?.id)?.type ?? null
  const isAuthor = user?.id === post.user_id

  const formattedDate = new Date(post.created_at).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 게시글 본문 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="font-medium text-gray-600">{(post.profiles as any)?.username}</span>
              <span>{formattedDate}</span>
              <span>👁 {post.views + 1}</span>
            </div>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                href={`/posts/${id}/edit`}
                className="text-sm text-gray-500 hover:text-orange-500 px-2 py-1 rounded hover:bg-gray-50"
              >
                수정
              </Link>
              <DeletePostButton postId={id} />
            </div>
          )}
        </div>

        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-4 mb-6">
          {post.content}
        </div>

        {/* 좋아요/싫어요 */}
        <ReactionButtons
          postId={id}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          userReaction={userReaction}
          isLoggedIn={!!user}
        />
      </div>

      {/* 댓글 */}
      <CommentSection
        postId={id}
        comments={(comments as any) ?? []}
        currentUserId={user?.id ?? null}
      />

      <Link href="/" className="block text-center text-sm text-gray-500 hover:text-orange-500 py-2">
        ← 목록으로
      </Link>
    </div>
  )
}
