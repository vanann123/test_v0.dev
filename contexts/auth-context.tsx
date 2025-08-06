'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  saveScore: (score: number, level: number) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()

      if (existingUser) {
        toast.error('Tên người dùng đã được sử dụng')
        return false
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Vui lòng kiểm tra email để xác nhận tài khoản')
      } else {
        toast.success('Đăng ký thành công!')
      }

      return true
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng ký')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Đăng nhập thành công!')
      return true
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng nhập')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Đăng xuất thành công!')
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng xuất')
    } finally {
      setLoading(false)
    }
  }

  const saveScore = async (score: number, level: number): Promise<boolean> => {
    if (!user || !userProfile) return false

    try {
      const { error } = await supabase
        .from('scores')
        .insert({
          user_id: user.id,
          username: userProfile.username,
          score,
          level
        })

      if (error) throw error

      toast.success('Điểm số đã được lưu!')
      return true
    } catch (error: any) {
      console.error('Error saving score:', error)
      toast.error('Không thể lưu điểm số')
      return false
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    saveScore
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
