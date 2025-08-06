"use client"

import { useState } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { GameHeader } from '@/components/game-header'
import { SignInForm } from '@/components/auth/signin-form'
import { SignUpForm } from '@/components/auth/signup-form'
import { Leaderboard } from '@/components/leaderboard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Toaster } from 'sonner'

export default function GamePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="container mx-auto px-4 py-8">
          <GameHeader 
            onShowAuth={() => setShowAuth(true)}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
          
          {/* Game Container */}
          <div className="game-container bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="game-header text-center mb-6">
              <div className="game-stats flex justify-center gap-8 mb-4">
                <div className="stat bg-white/20 px-6 py-3 rounded-xl">
                  <span className="label text-yellow-300 font-medium">Điểm:</span>
                  <span id="score" className="ml-2 text-white font-bold text-xl">0</span>
                </div>
                <div className="stat bg-white/20 px-6 py-3 rounded-xl">
                  <span className="label text-yellow-300 font-medium">Mạng:</span>
                  <span id="lives" className="ml-2 text-white font-bold text-xl">3</span>
                </div>
                <div className="stat bg-white/20 px-6 py-3 rounded-xl">
                  <span className="label text-yellow-300 font-medium">Level:</span>
                  <span id="level" className="ml-2 text-white font-bold text-xl">1</span>
                </div>
              </div>
            </div>
            
            <canvas 
              id="gameCanvas" 
              width="800" 
              height="600"
              className="border-4 border-white/30 rounded-xl bg-gradient-to-b from-sky-200 to-green-200 block mx-auto cursor-crosshair shadow-lg"
            />
            
            <div className="game-controls flex justify-between items-center mt-6 gap-6">
              <div className="instructions flex-1 bg-white/10 p-4 rounded-xl text-white">
                <p className="font-bold mb-2">Cách chơi:</p>
                <p className="text-sm mb-1">• Di chuyển chuột để ngắm</p>
                <p className="text-sm mb-1">• Click chuột trái để bắn</p>
                <p className="text-sm mb-1">• Bắn trúng bóng để ghi điểm</p>
                <p className="text-sm">• Đừng để bóng chạm đáy!</p>
              </div>
              <div className="game-buttons flex gap-3">
                <button id="startBtn" className="btn btn-primary bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold uppercase transition-all hover:scale-105">
                  Bắt Đầu
                </button>
                <button id="pauseBtn" className="btn btn-secondary bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold uppercase transition-all hover:scale-105" disabled>
                  Tạm Dừng
                </button>
                <button id="resetBtn" className="btn btn-danger bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase transition-all hover:scale-105">
                  Chơi Lại
                </button>
              </div>
            </div>
            
            {/* Game Over Modal */}
            <div id="gameOverModal" className="modal fixed inset-0 bg-black/80 flex items-center justify-center z-50 hidden">
              <div className="modal-content bg-gradient-to-br from-blue-600 to-purple-600 p-10 rounded-2xl text-center shadow-2xl border border-white/20">
                <h2 className="text-3xl font-bold mb-4 text-yellow-300">Game Over!</h2>
                <p className="text-xl mb-8 text-white">
                  Điểm số của bạn: <span id="finalScore" className="font-bold text-yellow-300">0</span>
                </p>
                <button id="playAgainBtn" className="btn btn-primary bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold uppercase transition-all hover:scale-105">
                  Chơi Lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Dialog */}
        <Dialog open={showAuth} onOpenChange={setShowAuth}>
          <DialogContent className="sm:max-w-md">
            {authMode === 'signin' ? (
              <SignInForm onToggleMode={toggleAuthMode} />
            ) : (
              <SignUpForm onToggleMode={toggleAuthMode} />
            )}
          </DialogContent>
        </Dialog>

        {/* Leaderboard Dialog */}
        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <Leaderboard />
          </DialogContent>
        </Dialog>

        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}
