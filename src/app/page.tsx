// Created: 2026-03-06 16:14
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const pageSize = 10
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts, count } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(username, avatar_url),
      comments(count),
      reactions(count)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 메인 콘텐츠 */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">최신 글</h2>
          <Link
            href="/posts/new"
            className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors"
          >
            + 글쓰기
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post as any} currentUserId={user?.id} />
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
            아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/?page=${p}`}
                className={`px-3 py-1 rounded text-sm ${
                  p === currentPage
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 사이드바 */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src="/comlogo.png" alt="로고" className="w-8 h-8 rounded" />
            <h3 className="font-bold text-gray-800">커뮤니티에 오신 것을 환영합니다!</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            자유롭게 글을 쓰고, 댓글을 달고, 좋아요를 눌러보세요.
          </p>
          <Link
            href="/posts/new"
            className="block w-full text-center bg-orange-500 text-white py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            글쓰기
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">빠른 이동</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/search" className="text-sm text-gray-600 hover:text-orange-500">
                🔍 글 검색
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-orange-500">
                👤 내 정보
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
