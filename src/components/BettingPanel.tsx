import { Button } from './ui/button';
import { Chicken } from './ChickenRaceGame';

interface BettingPanelProps {
  chickens: Chicken[];
  selectedChicken: number | null;
  betAmount: number;
  balance: number;
  onChickenSelect: (id: number) => void;
  onBetAmountChange: (amount: number) => void;
  onStartRace: () => void;
  isRacing: boolean;
}

const BettingPanel = ({
  chickens,
  selectedChicken,
  betAmount,
  balance,
  onChickenSelect,
  onBetAmountChange,
  onStartRace,
  isRacing
}: BettingPanelProps) => {
  const betAmounts = [10, 25, 50, 100, 250];
  const maxBet = balance;
  const potentialWin = selectedChicken 
    ? betAmount * (chickens.find(c => c.id === selectedChicken)?.odds || 1) 
    : 0;

  return (
    <div className="bg-gradient-to-r from-farm-barn to-farm-earth p-6 rounded-lg border-2 border-farm-fence text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chicken Selection */}
        <div>
          <h3 className="text-lg font-bold mb-3">Choose Your Chicken</h3>
          <div className="space-y-2">
            {chickens.map((chicken) => (
              <button
                key={chicken.id}
                onClick={() => onChickenSelect(chicken.id)}
                disabled={isRacing}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedChicken === chicken.id
                    ? 'border-farm-gold bg-farm-gold/20 shadow-glow-warm'
                    : 'border-white/20 bg-white/10 hover:bg-white/20'
                } ${isRacing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${
                      chicken.color === 'yellow' ? 'bg-gradient-warm' :
                      chicken.color === 'red' ? 'bg-gradient-sunset' :
                      chicken.color === 'blue' ? 'bg-gradient-cool' :
                      chicken.color === 'green' ? 'bg-gradient-nature' :
                      'bg-gradient-glow'
                    }`}></span>
                    {chicken.name}
                  </span>
                  <span className="font-bold text-farm-gold">{chicken.odds}x</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
        <div>
          <h3 className="text-lg font-bold mb-3">Bet Amount</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {betAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => onBetAmountChange(amount)}
                  disabled={isRacing || amount > balance}
                  className={`p-2 rounded border-2 transition-colors ${
                    betAmount === amount
                      ? 'border-farm-gold bg-farm-gold/20 text-farm-gold'
                      : amount > balance
                      ? 'border-red-500/50 bg-red-500/20 text-red-300 cursor-not-allowed'
                      : 'border-white/30 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {amount} SOL
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Custom:</span>
              <input
                type="number"
                min="1"
                max={maxBet}
                value={betAmount}
                onChange={(e) => onBetAmountChange(Math.min(Number(e.target.value), maxBet))}
                disabled={isRacing}
                className="flex-1 p-2 rounded bg-white/10 border border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="mt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Balance:</span>
              <span className="text-farm-gold font-bold">{balance} SOL</span>
            </div>
            {selectedChicken && (
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="text-green-400 font-bold">{potentialWin.toFixed(2)} SOL</span>
              </div>
            )}
          </div>
        </div>

        {/* Start Race */}
        <div className="flex flex-col justify-center">
          <Button
            onClick={onStartRace}
            disabled={!selectedChicken || betAmount <= 0 || betAmount > balance || isRacing}
            size="lg"
            className={`h-16 text-lg font-bold ${
              !selectedChicken || betAmount <= 0 || betAmount > balance
                ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-glow-nature'
            }`}
          >
            {isRacing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Racing...
              </div>
            ) : (
              'START RACE! 🏁'
            )}
          </Button>
          
          {(!selectedChicken || betAmount <= 0 || betAmount > balance) && !isRacing && (
            <p className="text-xs text-red-300 mt-2 text-center">
              {!selectedChicken && "Select a chicken"}
              {selectedChicken && betAmount <= 0 && "Enter bet amount"}
              {selectedChicken && betAmount > balance && "Insufficient balance"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettingPanel;