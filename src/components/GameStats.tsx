interface GameStatsProps {
  balance: number;
  totalWins: number;
  totalRaces: number;
  lastResult?: {
    winner: number;
    winnings: number;
    wasCorrect: boolean;
  } | null;
}

const GameStats = ({ balance, totalWins, totalRaces, lastResult }: GameStatsProps) => {
  const winRate = totalRaces > 0 ? ((totalWins / totalRaces) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-gradient-to-r from-farm-earth/90 to-farm-barn/90 p-4 rounded-lg border border-farm-fence/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-farm-gold">{balance}</div>
          <div className="text-xs text-white/70">Balance (SOL)</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">{totalWins}</div>
          <div className="text-xs text-white/70">Wins</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">{totalRaces}</div>
          <div className="text-xs text-white/70">Total Races</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">{winRate}%</div>
          <div className="text-xs text-white/70">Win Rate</div>
        </div>
      </div>

      {lastResult && (
        <div className="mt-4 p-3 rounded-lg border-2 border-farm-fence/30 bg-white/5">
          <div className="text-center">
            <div className={`text-lg font-bold ${lastResult.wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {lastResult.wasCorrect ? '🎉 YOU WON!' : '😔 Better luck next time'}
            </div>
            <div className="text-sm text-white/70 mt-1">
              Winner: Chicken {lastResult.winner} | 
              {lastResult.wasCorrect ? ` Won: +${lastResult.winnings} SOL` : ` Lost: ${Math.abs(lastResult.winnings)} SOL`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;