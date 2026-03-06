// Created: 2026-03-06 16:14
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const username = (formData.get('username') as string).trim()
  const bio = (formData.get('bio') as string).trim()

  if (!username || username.length < 2) return { error: '사용자 이름은 2자 이상이어야 합니다.' }

  const { error } = await supabase
    .from('profiles')
    .update({ username, bio: bio || null })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: '이미 사용 중인 닉네임입니다.' }
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}
