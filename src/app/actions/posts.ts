// Created: 2026-03-06 16:14
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string).trim()
  const content = (formData.get('content') as string).trim()

  if (!title || !content) return { error: '제목과 내용을 입력해주세요.' }

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect(`/posts/${data.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string).trim()
  const content = (formData.get('content') as string).trim()

  if (!title || !content) return { error: '제목과 내용을 입력해주세요.' }

  const { error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/posts/${id}`)
  revalidatePath('/')
  redirect(`/posts/${id}`)
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/')
  redirect('/')
}

export async function incrementViews(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('views').eq('id', id).single()
  if (data) {
    await supabase.from('posts').update({ views: data.views + 1 }).eq('id', id)
  }
}
