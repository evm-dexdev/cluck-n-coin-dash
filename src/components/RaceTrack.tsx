import { Chicken } from './ChickenRaceGame';

interface RaceTrackProps {
  chickens: Chicken[];
  raceProgress: { [key: number]: number };
  isRacing: boolean;
}

const RaceTrack = ({ chickens, raceProgress, isRacing }: RaceTrackProps) => {
  return (
    <div className="bg-gradient-to-b from-farm-sky to-farm-grass p-6 rounded-lg border-2 border-farm-fence">
      <h2 className="text-2xl font-bold text-farm-earth mb-4 text-center">
        CHICKEN RACE
      </h2>
      
      <div className="space-y-3">
        {chickens.map((chicken) => (
          <div key={chicken.id} className="relative">
            {/* Lane background */}
            <div className="bg-farm-dirt/20 rounded-lg p-3 border border-farm-fence/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-farm-earth">
                  Lane {chicken.id}
                </span>
                <span 
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    chicken.color === 'yellow' ? 'bg-gradient-warm text-white' :
                    chicken.color === 'red' ? 'bg-gradient-sunset text-white' :
                    chicken.color === 'blue' ? 'bg-gradient-cool text-white' :
                    chicken.color === 'green' ? 'bg-gradient-nature text-white' :
                    'bg-gradient-glow text-farm-earth'
                  }`}
                >
                  {chicken.odds}x
                </span>
              </div>
              
              {/* Race lane */}
              <div className="relative h-12 bg-farm-grass/30 rounded-full border-2 border-farm-fence/20 overflow-hidden">
                {/* Lane dividers */}
                <div className="absolute inset-y-0 left-1/4 w-px bg-white/20"></div>
                <div className="absolute inset-y-0 left-2/4 w-px bg-white/20"></div>
                <div className="absolute inset-y-0 left-3/4 w-px bg-white/20"></div>
                
                {/* Finish line */}
                <div className="absolute right-2 inset-y-0 w-1 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
                
                {/* Chicken */}
                <div 
                  className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                    isRacing ? 'animate-pulse' : ''
                  } ${
                    chicken.color === 'yellow' ? 'bg-gradient-warm shadow-glow-warm' :
                    chicken.color === 'red' ? 'bg-gradient-sunset shadow-glow-sunset' :
                    chicken.color === 'blue' ? 'bg-gradient-cool shadow-glow-cool' :
                    chicken.color === 'green' ? 'bg-gradient-nature shadow-glow-nature' :
                    'bg-gradient-glow shadow-glow'
                  }`}
                  style={{
                    left: `${Math.min(raceProgress[chicken.id] || 0, 85)}%`
                  }}
                >
                  🐔
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-xs text-farm-earth/70">
                <span>{chicken.name}</span>
                <span>{Math.round(raceProgress[chicken.id] || 0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isRacing && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-glow text-farm-earth px-4 py-2 rounded-full font-bold animate-pulse">
            🏁 Race in Progress... 🏁
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;