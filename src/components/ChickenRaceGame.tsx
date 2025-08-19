import { useState, useCallback } from 'react';
import RaceTrack from './RaceTrack';
import BettingPanel from './BettingPanel';
import GameStats from './GameStats';

export interface Chicken {
  id: number;
  name: string;
  color: string;
  odds: number;
}

const ChickenRaceGame = () => {
  // Game state
  const [balance, setBalance] = useState(1000);
  const [selectedChicken, setSelectedChicken] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isRacing, setIsRacing] = useState(false);
  const [raceProgress, setRaceProgress] = useState<{ [key: number]: number }>({});
  const [totalWins, setTotalWins] = useState(0);
  const [totalRaces, setTotalRaces] = useState(0);
  const [lastResult, setLastResult] = useState<{
    winner: number;
    winnings: number;
    wasCorrect: boolean;
  } | null>(null);

  // Chickens data
  const chickens: Chicken[] = [
    { id: 1, name: "Lightning Larry", color: "yellow", odds: 2.5 },
    { id: 2, name: "Speedy Susan", color: "red", odds: 1.8 },
    { id: 3, name: "Rocket Ruby", color: "blue", odds: 3.2 },
    { id: 4, name: "Turbo Tom", color: "green", odds: 2.1 },
    { id: 5, name: "Flash Fiona", color: "purple", odds: 4.0 },
  ];

  const startRace = useCallback(() => {
    if (!selectedChicken || betAmount <= 0 || betAmount > balance) return;
    
    setIsRacing(true);
    setRaceProgress({});
    setLastResult(null);
    
    // Initialize progress
    const initialProgress: { [key: number]: number } = {};
    chickens.forEach(chicken => {
      initialProgress[chicken.id] = 0;
    });
    setRaceProgress(initialProgress);

    // Simulate race
    const raceInterval = setInterval(() => {
      setRaceProgress(prev => {
        const newProgress = { ...prev };
        let raceFinished = false;
        let winner = 0;

        chickens.forEach(chicken => {
          // Different speeds based on odds (lower odds = faster)
          const baseSpeed = Math.random() * 3 + 1;
          const oddsMultiplier = 1 / chicken.odds;
          const speed = baseSpeed * oddsMultiplier * 0.8;
          
          newProgress[chicken.id] = Math.min((prev[chicken.id] || 0) + speed, 100);
          
          if (newProgress[chicken.id] >= 100 && !raceFinished) {
            raceFinished = true;
            winner = chicken.id;
          }
        });

        if (raceFinished) {
          clearInterval(raceInterval);
          
          // Calculate results
          setTimeout(() => {
            const wasCorrect = winner === selectedChicken;
            const winnings = wasCorrect 
              ? betAmount * (chickens.find(c => c.id === selectedChicken)?.odds || 1) - betAmount
              : -betAmount;
            
            setBalance(prev => prev + winnings);
            setTotalRaces(prev => prev + 1);
            if (wasCorrect) {
              setTotalWins(prev => prev + 1);
            }
            
            setLastResult({
              winner,
              winnings,
              wasCorrect
            });
            
            setIsRacing(false);
          }, 1000);
        }

        return newProgress;
      });
    }, 100);

  }, [selectedChicken, betAmount, balance, chickens]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
          🐔 SOLANA CHICKEN RUN 🐔
        </h1>
        <p className="text-xl text-white/80 drop-shadow">
          Place your bets and watch the chickens race!
        </p>
      </div>

      <GameStats 
        balance={balance}
        totalWins={totalWins}
        totalRaces={totalRaces}
        lastResult={lastResult}
      />

      <RaceTrack 
        chickens={chickens}
        raceProgress={raceProgress}
        isRacing={isRacing}
      />

      <BettingPanel
        chickens={chickens}
        selectedChicken={selectedChicken}
        betAmount={betAmount}
        balance={balance}
        onChickenSelect={setSelectedChicken}
        onBetAmountChange={setBetAmount}
        onStartRace={startRace}
        isRacing={isRacing}
      />
    </div>
  );
};

export default ChickenRaceGame;