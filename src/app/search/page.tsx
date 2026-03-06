// Created: 2026-03-06 16:14
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import SearchForm from '@/components/SearchForm'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const supabase = await createClient()

  let posts: any[] = []

  if (query) {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url), comments(count), reactions(count)')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    posts = data ?? []
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">글 검색</h1>
        <SearchForm initialQuery={query} />
      </div>

      {query && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            &quot;{query}&quot; 검색 결과: {posts.length}건
          </p>
          {posts.length > 0 ? (
            <div className="space-y-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
