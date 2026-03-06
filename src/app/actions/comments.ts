// Created: 2026-03-06 16:14
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const content = (formData.get('content') as string).trim()
  if (!content) return { error: '댓글 내용을 입력해주세요.' }

  const { error } = await supabase
    .from('comments')
    .insert({ content, post_id: postId, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath(`/posts/${postId}`)
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id)
  revalidatePath(`/posts/${postId}`)
}

export async function toggleReaction(postId: string, type: 'like' | 'dislike') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 기존 반응 조회
  const { data: existing } = await supabase
    .from('reactions')
    .select()
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    if (existing.type === type) {
      // 동일 타입 → 삭제
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      // 다른 타입 → 업데이트
      await supabase.from('reactions').update({ type }).eq('id', existing.id)
    }
  } else {
    // 신규 등록
    await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, type })
  }

  revalidatePath(`/posts/${postId}`)
}
