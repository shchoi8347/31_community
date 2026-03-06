// Created: 2026-03-06 16:14
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import PostCard from '@/components/PostCard'

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: myPosts } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url), comments(count), reactions(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const joinedAt = new Date(user.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{profile?.username}</h1>
            <p className="text-sm text-gray-400">가입일: {joinedAt}</p>
            {profile?.bio && <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>}
          </div>
        </div>

        <ProfileForm
          initialUsername={profile?.username ?? ''}
          initialBio={profile?.bio ?? ''}
        />
      </div>

      {/* 내가 쓴 글 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">내가 쓴 글 ({myPosts?.length ?? 0})</h2>
        {myPosts && myPosts.length > 0 ? (
          <div className="space-y-2">
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
            아직 작성한 글이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
