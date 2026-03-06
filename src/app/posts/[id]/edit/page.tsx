// Created: 2026-03-06 16:14
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditPostForm from '@/components/EditPostForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">글 수정</h1>
        <EditPostForm postId={id} initialTitle={post.title} initialContent={post.content} />
      </div>
    </div>
  )
}
