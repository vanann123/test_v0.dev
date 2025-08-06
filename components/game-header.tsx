'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Trophy, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface GameHeaderProps {
  onShowAuth: () => void
  onShowLeaderboard: () => void
}

export function GameHeader({ onShowAuth, onShowLeaderboard }: GameHeaderProps) {
  const { user, userProfile, signOut } = useAuth()

  return (
    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">🎯 Game Bắn Bóng</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowLeaderboard}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Bảng Xếp Hạng
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {user && userProfile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <User className="h-4 w-4 mr-2" />
                {userProfile.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userProfile.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onShowLeaderboard}>
                <Trophy className="h-4 w-4 mr-2" />
                Bảng Xếp Hạng
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng Xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={onShowAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Đăng Nhập
          </Button>
        )}
      </div>
    </div>
  )
}
