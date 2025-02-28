import React, { useEffect, useRef, useState } from 'react';
import { Game } from './game/Game';
import { Volume2, VolumeX, ArrowLeft, TowerControl as GameController } from 'lucide-react';
import { Difficulty } from './game/types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const gameRef = useRef<Game | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return;

    const canvas = canvasRef.current;
    
    // Adjust canvas size based on screen size
    if (isMobile) {
      const containerWidth = Math.min(window.innerWidth - 20, 800);
      const containerHeight = Math.min(window.innerHeight - 150, 500);
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    } else {
      canvas.width = 800;
      canvas.height = 500;
    }

    const game = new Game(
      canvas, 
      setScore, 
      setLives, 
      currentLevel, 
      difficulty,
      handleLevelComplete,
      isMobile
    );
    gameRef.current = game;
    
    game.start();
    game.setMuted(isMuted);

    return () => {
      game.stop();
    };
  }, [gameStarted, currentLevel, difficulty, isMobile]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setMuted(isMuted);
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const startGame = () => {
    setShowTitleScreen(false);
    setGameStarted(true);
    setScore(0);
    setLives(3);
  };

  const restartGame = () => {
    if (gameRef.current) {
      gameRef.current.stop();
    }
    setGameStarted(false);
    setTimeout(() => {
      startGame();
    }, 100);
  };

  const handleLevelComplete = () => {
    if (currentLevel < maxLevel) {
      if (gameRef.current) {
        gameRef.current.stop();
      }
      setCurrentLevel(prev => prev + 1);
      setTimeout(() => {
        if (gameRef.current) {
          gameRef.current.start();
        }
      }, 100);
    } else {
      // Game completed
      if (gameRef.current) {
        gameRef.current.stop();
      }
      setGameStarted(false);
      setShowLevelSelect(true);
      setShowTitleScreen(false);
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setShowLevelSelect(false);
    setShowTitleScreen(false);
    setGameStarted(true);
  };

  const backToMainMenu = () => {
    setShowLevelSelect(false);
    setShowTitleScreen(true);
  };

  // Touch controls for mobile
  const handleTouchMove = (direction: 'left' | 'right') => {
    if (gameRef.current) {
      gameRef.current.setTouchMove(direction);
    }
  };

  const handleTouchEnd = () => {
    if (gameRef.current) {
      gameRef.current.clearTouchMove();
    }
  };

  const handleJump = () => {
    if (gameRef.current) {
      gameRef.current.triggerJump();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {showTitleScreen ? (
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-lg shadow-2xl mb-8">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200"
            >
              {/* Pixelated Sky Background with Animation */}
              <div className="absolute inset-0 w-full h-full" 
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, #4ade80 0%, #4ade80 20%, transparent 20%),
                    repeating-linear-gradient(90deg, #60a5fa 0%, #60a5fa 10%, #93c5fd 10%, #93c5fd 20%)
                  `,
                  backgroundSize: '20px 100px, 100% 100%',
                  animation: 'animateSky 30s linear infinite',
                  imageRendering: 'pixelated'
                }}>
                {/* Animated Clouds */}
                <div className="absolute w-20 h-10 bg-white rounded-full top-10 left-10"
                  style={{
                    boxShadow: '10px 5px 0 5px white, 20px 0px 0 2px white',
                    animation: 'moveCloud 60s linear infinite',
                    opacity: 0.9,
                    imageRendering: 'pixelated'
                  }}
                ></div>
                <div className="absolute w-16 h-8 bg-white rounded-full top-20 left-40"
                  style={{
                    boxShadow: '8px 4px 0 4px white, 16px 0px 0 2px white',
                    animation: 'moveCloud 45s linear infinite 10s',
                    opacity: 0.8,
                    imageRendering: 'pixelated'
                  }}
                ></div>
                <div className="absolute w-24 h-12 bg-white rounded-full top-5 right-20"
                  style={{
                    boxShadow: '12px 6px 0 6px white, 24px 0px 0 3px white',
                    animation: 'moveCloud 50s linear infinite 5s',
                    opacity: 0.9,
                    imageRendering: 'pixelated'
                  }}
                ></div>
                
                {/* Pixelated Hills */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-green-600"
                  style={{
                    clipPath: 'polygon(0% 100%, 0% 30%, 5% 40%, 10% 35%, 15% 45%, 20% 30%, 25% 35%, 30% 20%, 35% 30%, 40% 25%, 45% 35%, 50% 30%, 55% 25%, 60% 35%, 65% 30%, 70% 40%, 75% 35%, 80% 25%, 85% 40%, 90% 30%, 95% 35%, 100% 25%, 100% 100%)',
                    imageRendering: 'pixelated'
                  }}
                ></div>
                
                {/* Pixelated Trees */}
                <div className="absolute bottom-24 left-1/4 w-16 h-24"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, #854d0e 60%, #854d0e 100%)',
                    imageRendering: 'pixelated'
                  }}
                >
                  <div className="absolute bottom-10 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                  <div className="absolute bottom-16 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                  <div className="absolute bottom-22 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                </div>
                
                <div className="absolute bottom-24 right-1/4 w-16 h-24"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, #854d0e 60%, #854d0e 100%)',
                    imageRendering: 'pixelated'
                  }}
                >
                  <div className="absolute bottom-10 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                  <div className="absolute bottom-16 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                  <div className="absolute bottom-22 left-0 w-16 h-16 bg-green-800"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      imageRendering: 'pixelated'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="relative px-8 py-16 text-center">
              <div className="animate-bounce mb-4 inline-block">
                <GameController size={64} className="text-yellow-300" />
              </div>
              <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">
                  Adventure Time!
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Embark on an epic journey through challenging levels, collect coins, 
                avoid enemies, and reach the portal to victory!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button 
                  onClick={() => {
                    setShowTitleScreen(false);
                    setShowLevelSelect(false);
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Play Game
                </button>
                <button 
                  onClick={() => {
                    setShowTitleScreen(false);
                    setShowLevelSelect(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Select Level
                </button>
              </div>
              <div className="text-sm text-gray-300 mt-8">
                <p>Use arrow keys or WASD to move, Space to jump</p>
                <p>Mobile? Touch controls will appear automatically</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-yellow-300 text-3xl mb-2">1</div>
                <h3 className="text-lg font-semibold text-white mb-2">Navigate Platforms</h3>
                <p className="text-gray-300">Jump between platforms to reach the portal at the end of each level</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-yellow-300 text-3xl mb-2">2</div>
                <h3 className="text-lg font-semibold text-white mb-2">Collect Coins</h3>
                <p className="text-gray-300">Gather all the coins to increase your score and unlock achievements</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-yellow-300 text-3xl mb-2">3</div>
                <h3 className="text-lg font-semibold text-white mb-2">Avoid Enemies</h3>
                <p className="text-gray-300">Watch out for enemies that patrol platforms - they'll cost you a life!</p>
              </div>
            </div>
            
            <div className="mt-8 text-gray-300 text-sm border-t border-gray-700 pt-4">
              <h3 className="font-bold mb-2">Play on other devices:</h3>
              <p>Run this command in your terminal to access the game on other devices:</p>
              <div className="bg-gray-900 p-2 rounded mt-2 text-left overflow-x-auto">
                <code>npx vite --host</code>
              </div>
              <p className="mt-2">Then open the network URL shown in the terminal on any device on your network.</p>
            </div>
          </div>
        </div>
      ) : !gameStarted ? (
        showLevelSelect ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <div className="flex justify-start mb-4">
              <button 
                onClick={backToMainMenu}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Select Level</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {Array.from({ length: maxLevel }, (_, i) => (
                <button 
                  key={i}
                  onClick={() => handleLevelSelect(i + 1)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200"
                >
                  Level {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to the Adventure!</h2>
            <p className="text-gray-300 mb-6">
              Collect coins, avoid enemies, and reach the end of each level.
            </p>
            <div className="mb-6 text-gray-300">
              <p className="mb-2"><span className="font-bold">Controls:</span></p>
              {isMobile ? (
                <ul>
                  <li>Touch left/right buttons to move</li>
                  <li>Touch jump button to jump</li>
                </ul>
              ) : (
                <ul>
                  <li>← → Arrow keys or W,A,S,D to move</li>
                  <li>↑ Arrow key or Space to jump</li>
                </ul>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Select Difficulty</h3>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => handleDifficultyChange(Difficulty.EASY)}
                  className={`py-2 px-4 rounded-lg transition duration-200 ${
                    difficulty === Difficulty.EASY 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Easy
                </button>
                <button 
                  onClick={() => handleDifficultyChange(Difficulty.NORMAL)}
                  className={`py-2 px-4 rounded-lg transition duration-200 ${
                    difficulty === Difficulty.NORMAL 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Normal
                </button>
                <button 
                  onClick={() => handleDifficultyChange(Difficulty.HARD)}
                  className={`py-2 px-4 rounded-lg transition duration-200 ${
                    difficulty === Difficulty.HARD 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button 
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Start Game
              </button>
              <button 
                onClick={() => setShowLevelSelect(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Select Level
              </button>
            </div>
            
            <div className="mt-8 text-gray-300 text-sm border-t border-gray-700 pt-4">
              <h3 className="font-bold mb-2">Play on other devices:</h3>
              <p>Run this command in your terminal to access the game on other devices:</p>
              <div className="bg-gray-900 p-2 rounded mt-2 text-left overflow-x-auto">
                <code>npx vite --host</code>
              </div>
              <p className="mt-2">Then open the network URL shown in the terminal on any device on your network.</p>
            </div>
          </div>
        )
      ) : (
        <div className="relative">
          <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-70 p-2 rounded-lg z-10 flex gap-4">
            <div className="text-white">Level: {currentLevel}</div>
            <div className="text-white">Score: {score}</div>
            <div className="text-white">Lives: {lives}</div>
            <div className="text-white">
              Difficulty: {Difficulty[difficulty].charAt(0) + Difficulty[difficulty].slice(1).toLowerCase()}
            </div>
          </div>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={() => {
                if (gameRef.current) {
                  gameRef.current.stop();
                }
                setGameStarted(false);
                setShowTitleScreen(true);
              }} 
              className="bg-gray-800 bg-opacity-70 p-2 rounded-lg text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={toggleMute} 
              className="bg-gray-800 bg-opacity-70 p-2 rounded-lg text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="border-4 border-gray-700 rounded-lg shadow-lg"
          />
          
          {/* Mobile touch controls */}
          {isMobile && gameStarted && (
            <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4">
              <div className="flex gap-4">
                <button
                  onTouchStart={() => handleTouchMove('left')}
                  onTouchEnd={handleTouchEnd}
                  className="bg-gray-800 bg-opacity-70 p-6 rounded-full text-white text-2xl w-16 h-16 flex items-center justify-center"
                >
                  ←
                </button>
                <button
                  onTouchStart={() => handleTouchMove('right')}
                  onTouchEnd={handleTouchEnd}
                  className="bg-gray-800 bg-opacity-70 p-6 rounded-full text-white text-2xl w-16 h-16 flex items-center justify-center"
                >
                  →
                </button>
              </div>
              <button
                onTouchStart={handleJump}
                className="bg-gray-800 bg-opacity-70 p-6 rounded-full text-white text-xl w-16 h-16 flex items-center justify-center"
              >
                ↑
              </button>
            </div>
          )}
          
          {lives <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-gray-300 mb-4">Final Score: {score}</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={restartGame}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Play Again
                  </button>
                  <button 
                    onClick={() => {
                      setGameStarted(false);
                      setShowTitleScreen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;