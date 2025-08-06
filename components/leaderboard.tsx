'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

interface LeaderboardEntry {
  id: string
  username: string
  score: number
  level: number
  created_at: string
}

export function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      
      // Get top 10 scores
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (error) throw error

      setScores(data || [])

      // Get user's rank if logged in
      if (user && userProfile) {
        const { data: userScores, error: userError } = await supabase
          .from('scores')
          .select('score')
          .eq('user_id', user.id)
          .order('score', { ascending: false })
          .limit(1)

        if (!userError && userScores && userScores.length > 0) {
          const userBestScore = userScores[0].score
          
          const { count, error: countError } = await supabase
            .from('scores')
            .select('*', { count: 'exact', head: true })
            .gt('score', userBestScore)

          if (!countError) {
            setUserRank((count || 0) + 1)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-5 w-5 text-blue-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Bảng Xếp Hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Bảng Xếp Hạng
        </CardTitle>
        <CardDescription>
          Top 10 người chơi có điểm số cao nhất
          {userRank && (
            <span className="block mt-1 text-sm font-medium text-blue-600">
              Hạng của bạn: #{userRank}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Chưa có điểm số nào được ghi nhận</p>
            <p className="text-sm">Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = userProfile?.username === entry.username
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all hover:shadow-md ${
                    isCurrentUser 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(rank)}`}>
                    {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-sm">{rank}</span>}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          Bạn
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Level {entry.level} • {new Date(entry.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">điểm</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
