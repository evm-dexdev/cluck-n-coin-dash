import { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TowerStep {
  id: number;
  multiplier: number;
  hasFire: boolean;
}

const ChickenTower = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  // Tower steps with increasing multipliers
  const steps: TowerStep[] = [
    { id: 0, multiplier: 1.0, hasFire: false },
    { id: 1, multiplier: 1.12, hasFire: false },
    { id: 2, multiplier: 1.27, hasFire: false },
    { id: 3, multiplier: 1.44, hasFire: false },
    { id: 4, multiplier: 1.64, hasFire: false },
    { id: 5, multiplier: 1.87, hasFire: false },
    { id: 6, multiplier: 2.14, hasFire: false },
    { id: 7, multiplier: 2.46, hasFire: false },
    { id: 8, multiplier: 2.84, hasFire: false },
    { id: 9, multiplier: 3.28, hasFire: false },
  ];

  const placeBet = useCallback(() => {
    if (betAmount <= 0 || betAmount > balance) return;
    
    setBalance(prev => prev - betAmount);
    setBetPlaced(true);
  }, [betAmount, balance]);

  const startGame = useCallback(() => {
    if (!betPlaced) return;
    
    setIsGameActive(true);
    setGameOver(false);
    setCurrentStep(0);
    setCurrentWinnings(betAmount);
  }, [betPlaced, betAmount]);

  const jumpToNextStep = useCallback(() => {
    if (!isGameActive || gameOver || isAnimating || currentStep >= steps.length - 1) return;

    setIsAnimating(true);

    // 25% chance of fire appearing
    const fireAppears = Math.random() < 0.25;

    setTimeout(() => {
      if (fireAppears) {
        setGameOver(true);
        setIsGameActive(false);
        setCurrentWinnings(0);
        setBetPlaced(false);
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setCurrentWinnings(betAmount * steps[nextStep].multiplier);
      }
      setIsAnimating(false);
    }, 800);
  }, [isGameActive, gameOver, isAnimating, currentStep, steps, betAmount]);

  const cashOut = useCallback(() => {
    if (!isGameActive || gameOver) return;
    
    setBalance(prev => prev + currentWinnings);
    setIsGameActive(false);
    setGameOver(false);
    setBetPlaced(false);
  }, [isGameActive, gameOver, currentWinnings]);

  const resetGame = useCallback(() => {
    setIsGameActive(false);
    setGameOver(false);
    setCurrentStep(0);
    setCurrentWinnings(0);
    setBetPlaced(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-farm-sky via-farm-grass to-farm-earth p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Race
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
            🐔 CHICKEN TOWER 🔥
          </h1>
          
          <div className="text-white text-right">
            <div className="text-sm opacity-70">Balance</div>
            <div className="text-lg font-bold text-farm-gold">{balance} SOL</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-gradient-to-b from-farm-barn/90 to-farm-earth/90 rounded-lg border-2 border-farm-fence p-6 mb-6">
          
          {/* Tower */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {steps.slice().reverse().map((step, index) => {
                const actualStep = steps.length - 1 - index;
                const isCurrentStep = actualStep === currentStep;
                const isPassed = actualStep < currentStep;
                const isNext = actualStep === currentStep + 1;
                
                return (
                  <div 
                    key={step.id}
                    className={`relative flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${
                      isPassed 
                        ? 'bg-green-500/30 border-green-400 shadow-glow-nature' 
                        : isCurrentStep 
                        ? 'bg-farm-gold/30 border-farm-gold shadow-glow-warm animate-pulse' 
                        : 'bg-white/10 border-white/30'
                    }`}
                  >
                    {/* Step Content */}
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        isPassed ? 'text-green-300' : 
                        isCurrentStep ? 'text-farm-gold' : 'text-white'
                      }`}>
                        {step.multiplier.toFixed(2)}x
                      </div>
                      <div className="text-xs text-white/70">
                        Step {step.id + 1}
                      </div>
                    </div>

                    {/* Chicken */}
                    {isCurrentStep && (
                      <div className={`absolute left-4 text-2xl ${
                        isAnimating ? 'animate-bounce' : ''
                      }`}>
                        🐔
                      </div>
                    )}

                    {/* Fire (when game over on this step) */}
                    {gameOver && isCurrentStep && (
                      <div className="absolute right-4 text-2xl animate-pulse">
                        🔥
                      </div>
                    )}

                    {/* Next step indicator */}
                    {isNext && isGameActive && !gameOver && (
                      <div className="absolute -right-2 text-lg animate-pulse">
                        ⬆️
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Status */}
          <div className="text-center mb-6">
            {!isGameActive && !gameOver && (
              <div className="text-white">
                <div className="text-lg mb-2">Place your bet and start climbing!</div>
                <div className="text-sm opacity-70">Each step increases your multiplier, but fire might appear...</div>
              </div>
            )}
            
            {isGameActive && !gameOver && (
              <div className="text-white">
                <div className="text-lg mb-2">Current Winnings: <span className="text-farm-gold font-bold">{currentWinnings.toFixed(2)} SOL</span></div>
                <div className="text-sm opacity-70">Keep climbing or cash out safely?</div>
              </div>
            )}
            
            {gameOver && (
              <div className="text-white">
                <div className="text-lg mb-2 text-red-400">🔥 BURNED! 🔥</div>
                <div className="text-sm opacity-70">The fire got you! Better luck next time.</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-farm-earth to-farm-barn p-6 rounded-lg border-2 border-farm-fence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Bet Amount */}
            <div className="text-white">
              <label className="block text-sm font-medium mb-2">Bet Amount</label>
              <div className="flex gap-2 mb-2">
                {[10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isGameActive || betPlaced}
                    className={`px-3 py-1 rounded text-sm border ${
                      betAmount === amount 
                        ? 'bg-farm-gold/30 border-farm-gold text-farm-gold' 
                        : 'bg-white/10 border-white/30 hover:bg-white/20'
                    } ${isGameActive || betPlaced ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max={balance}
                value={betAmount}
                onChange={(e) => setBetAmount(Math.min(Number(e.target.value), balance))}
                disabled={isGameActive || betPlaced}
                className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                placeholder="Custom amount"
              />
            </div>

            {/* Game Actions */}
            <div className="flex flex-col gap-2">
              {!betPlaced && !isGameActive && !gameOver && (
                <Button
                  onClick={placeBet}
                  disabled={betAmount <= 0 || betAmount > balance}
                  size="lg"
                  className="bg-farm-gold hover:bg-farm-gold/80 text-farm-earth font-bold"
                >
                  PLACE BET ({betAmount} SOL)
                </Button>
              )}

              {betPlaced && !isGameActive && !gameOver && (
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  START CLIMBING
                </Button>
              )}
              
              {isGameActive && !gameOver && (
                <>
                  <Button
                    onClick={jumpToNextStep}
                    disabled={isAnimating || currentStep >= steps.length - 1}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {isAnimating ? 'JUMPING...' : 'JUMP UP! 🪜'}
                  </Button>
                  
                  <Button
                    onClick={cashOut}
                    disabled={isAnimating}
                    size="lg"
                    className="bg-farm-gold hover:bg-farm-gold/80 text-farm-earth font-bold"
                  >
                    CASH OUT ({currentWinnings.toFixed(2)} SOL)
                  </Button>
                </>
              )}
              
              {gameOver && (
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  TRY AGAIN
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="text-white text-sm">
              <div className="bg-white/10 rounded p-3">
                <div className="flex justify-between mb-1">
                  <span>Current Step:</span>
                  <span className="font-bold">{currentStep + 1}/{steps.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Current Multiplier:</span>
                  <span className="font-bold text-farm-gold">{steps[currentStep].multiplier.toFixed(2)}x</span>
                </div>
                {currentStep < steps.length - 1 && (
                  <div className="flex justify-between">
                    <span>Next Multiplier:</span>
                    <span className="font-bold text-green-400">{steps[currentStep + 1].multiplier.toFixed(2)}x</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChickenTower;