'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Trophy, User, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface GameHeaderProps {
  onShowAuth: () => void
  onShowLeaderboard: () => void
}

export function GameHeader({ onShowAuth, onShowLeaderboard }: GameHeaderProps) {
  const { user, userProfile, signOut } = useAuth()

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="text-center flex-1">
        <h1 className="text-4xl font-bold text-white mb-2">🎯 Ball Shooting Game</h1>
        <p className="text-white/80">Bắn bóng để ghi điểm và leo lên bảng xếp hạng!</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={onShowLeaderboard}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Bảng Xếp Hạng
        </Button>

        {user && userProfile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <User className="h-4 w-4 mr-2" />
                {userProfile.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={onShowAuth}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Đăng nhập
          </Button>
        )}
      </div>
    </div>
  )
}
