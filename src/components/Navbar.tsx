// Created: 2026-03-06 16:14
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/comlogo.png" alt="커뮤니티 로고" width={32} height={32} className="rounded" />
          <span className="font-bold text-orange-500 text-lg">커뮤니티</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/search" className="text-gray-500 hover:text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-100">
            검색
          </Link>
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors"
              >
                글쓰기
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-100">
                내 정보
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-100">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
