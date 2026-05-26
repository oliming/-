import { useState } from 'react';
import { Restaurant, ReactionType } from '../types';
import { Compass, Sparkles, MapPin, Smile, ArrowRight, Star } from 'lucide-react';

interface TasteMapProps {
  restaurants: Restaurant[];
  reactions: Record<string, ReactionType>;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export default function TasteMap({ restaurants, reactions, onSelectRestaurant }: TasteMapProps) {
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(restaurants[0] || null);
  const [selectedFilter, setSelectedFilter] = useState<ReactionType | null>(null);

  // Filter restaurants mapped by selected legend state
  const filteredRestaurants = selectedFilter
    ? restaurants.filter((r) => reactions[r.id] === selectedFilter)
    : restaurants;

  // Map reaction categories to fun colors
  const getReactionConfig = (id: string) => {
    const r = reactions[id];
    switch (r) {
      case 'superb':
        return {
          color: 'bg-[#FCA836] border-[#004098]',
          text: '夯爆了 🔥',
          glow: 'animate-ping shadow-[0_0_15px_#FCA836]',
          icon: '🔥',
          textColor: 'text-[#FCA836]',
        };
      case 'want_to_try':
        return {
          color: 'bg-[#FBDF04] border-[#004098]',
          text: '想尝试 ✨',
          glow: 'shadow-[0_0_8px_#FBDF04]',
          icon: '✨',
          textColor: 'text-[#FBDF04]',
        };
      case 'ok':
        return {
          color: 'bg-[#B8EEF0] border-[#004098]',
          text: '还不错 👍',
          glow: '',
          icon: '👍',
          textColor: 'text-sky-600',
        };
      case 'fine':
        return {
          color: 'bg-emerald-300 border-[#004098]',
          text: '还可以 💁',
          glow: '',
          icon: '💁',
          textColor: 'text-emerald-500',
        };
      case 'bad':
        return {
          color: 'bg-gray-400 border-gray-600 grayscale',
          text: '好难吃 👎',
          glow: '',
          icon: '👎',
          textColor: 'text-gray-500',
        };
      case 'no_interest':
        return {
          color: 'bg-indigo-300/60 border-indigo-400 opacity-60 strike-through',
          text: '没兴趣 ❌',
          glow: '',
          icon: '❌',
          textColor: 'text-indigo-400',
        };
      case 'never_tried' as any:
        return {
          color: 'bg-indigo-300 border-[#004098]',
          text: '没吃过 🧭',
          glow: '',
          icon: '🧭',
          textColor: 'text-indigo-400',
        };
      default:
        return {
          color: 'bg-white border-dashed border-gray-400',
          text: '未评估 ❔',
          glow: '',
          icon: '❔',
          textColor: 'text-gray-400',
        };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Map Interactive Arena */}
      <div className="relative w-full aspect-square bg-[#004098] rounded-3xl border-4 border-[#004098] shadow-[8px_8px_0px_#004098] overflow-hidden p-6 flex flex-col justify-between">
        {/* Radar grid backgrounds */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-4/5 h-4/5 border border-dashed border-white rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="w-3/5 h-3/5 border border-white rounded-full absolute" />
          <div className="w-2/5 h-2/5 border border-dashed border-white rounded-full absolute" />
          <div className="w-[1px] h-full bg-white absolute" />
          <div className="h-[1px] w-full bg-white absolute" />
        </div>

        {/* Pulse / Scan Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#B8EEF0]/5 to-transparent pointer-events-none origin-center animate-[spin_8s_linear_infinite]" />

        {/* Header Overlay inside Map */}
        <div className="z-10 flex justify-between items-center bg-[#FBDF04] border-2 border-[#004098] px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#004098] self-start font-mono text-xs font-black text-[#004098] tracking-tight">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#004098] animate-spin" style={{ animationDuration: '4s' }} />
            <span>
              SOHO 1KM TASTE MAP
            </span>
          </div>
        </div>

        {/* Main Office (Center of Map) */}
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#FCA836] border-2 border-[#004098] flex items-center justify-center shadow-[0_0_12px_#FCA836] animate-bounce">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <div className="mt-1 bg-white border border-[#004098] rounded px-1.5 py-0.5 text-[9px] font-black tracking-tighter text-[#004098] shadow-[1px_1.5px_0px_#004098] whitespace-nowrap">
            🏢 复兴 SOHO
          </div>
        </div>

        {/* Empty State overlay */}
        {filteredRestaurants.length === 0 && (
          <div className="absolute inset-x-4 top-[30%] bottom-[20%] z-25 bg-white/95 border-3 border-[#004098] rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-[4px_4px_0px_rgba(0,0,0,0.15)] animate-fade-in">
            <span className="text-3xl mb-1.5 animate-bounce">🍱</span>
            <p className="text-xs font-black text-[#004098]">
              此类别下暂无餐厅匹配
            </p>
            <p className="text-[10px] text-gray-500 font-bold mt-1">
              试试点击下方其他反馈，或点左侧“全部”
            </p>
          </div>
        )}

        {/* Restaurant Dots */}
        {filteredRestaurants.map((rest) => {
          const config = getReactionConfig(rest.id);
          // Scale percentages: center is 50%, coordinates are approx -100 to 100
          const leftPercent = 50 + (rest.coordinates.x * 0.45);
          const topPercent = 50 - (rest.coordinates.y * 0.45);

          const isSelected = selectedRest?.id === rest.id;

          return (
            <div
              key={rest.id}
              className="absolute group transition-transform duration-200"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Outer Glow ring */}
              {config.glow && (
                <span className={`absolute -inset-1.5 rounded-full opacity-75 ${config.glow}`} />
              )}

              {/* Point Button */}
              <button
                id={`map-dot-${rest.id}`}
                onClick={() => {
                  setSelectedRest(rest);
                  if (onSelectRestaurant) onSelectRestaurant(rest);
                }}
                className={`relative w-8 h-8 rounded-full border-2 border-[#004098] flex items-center justify-center transition-all ${
                  config.color
                } ${
                  isSelected ? 'scale-125 z-30 ring-4 ring-[#FBDF04]' : 'hover:scale-115 z-10'
                }`}
              >
                <span className="text-sm select-none">{rest.emoji}</span>
              </button>

              {/* Hover Mini Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 scale-0 group-hover:scale-100 transition-transform duration-150 z-40 pointer-events-none">
                <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded border border-white whitespace-nowrap shadow-md">
                  {rest.name} ({config.icon})
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend Panel overlay at bottom */}
        <div className="z-10 flex gap-1.5 overflow-x-auto py-1 pr-1 pointer-events-auto max-w-full scrollbar-none mt-auto items-center">
          <button
            onClick={() => {
              setSelectedFilter(null);
              if (restaurants.length > 0) {
                setSelectedRest(restaurants[0]);
              }
            }}
            className={`flex items-center justify-center border-2 border-[#004098] px-2 py-0.5 rounded-lg text-[9px] font-black whitespace-nowrap shadow-[1.5px_1.5px_0px_#004098] cursor-pointer transition-all active:scale-95 ${
              selectedFilter === null ? 'bg-[#FBDF04] text-black ring-1 ring-[#004098]' : 'bg-white/95 text-slate-650 opacity-80'
            }`}
          >
            全部
          </button>
          {['superb', 'want_to_try', 'ok', 'no_interest', 'bad'].map((rt) => {
            let label = '';
            let dotBg = '';
            if (rt === 'superb') { label = '夯爆'; dotBg = 'bg-[#FCA836]'; }
            else if (rt === 'want_to_try') { label = '想试'; dotBg = 'bg-[#FBDF04]'; }
            else if (rt === 'ok') { label = '还行'; dotBg = 'bg-[#B8EEF0]'; }
            else if (rt === 'no_interest') { label = '无感'; dotBg = 'bg-indigo-300'; }
            else if (rt === 'bad') { label = '拉胯'; dotBg = 'bg-gray-400 grayscale'; }

            const isActive = selectedFilter === rt;

            return (
              <button
                key={rt}
                onClick={() => {
                  const nextFilter = isActive ? null : (rt as ReactionType);
                  setSelectedFilter(nextFilter);
                  const filtered = nextFilter
                    ? restaurants.filter((r) => reactions[r.id] === nextFilter)
                    : restaurants;
                  if (filtered.length > 0) {
                    setSelectedRest(filtered[0]);
                  } else {
                    setSelectedRest(null);
                  }
                }}
                className={`flex items-center gap-1 bg-white/95 border-2 border-[#004098] px-2 py-0.5 rounded-lg text-[9px] font-bold whitespace-nowrap shadow-[1.5px_1.5px_0px_#004098] cursor-pointer transition-all active:scale-95 ${
                  isActive ? 'bg-[#FBDF04] text-[#004098] font-black scale-105 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] ring-1 ring-[#004098]' : 'hover:bg-slate-50 opacity-80'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full border border-[#004098] ${dotBg}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Restaurant Information Detail Section (Startup-style card) */}
      {selectedRest && (
        <div className="bg-white border-4 border-[#004098] p-4 rounded-3xl shadow-[5px_5px_0px_#004098] relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8EEF0] rounded-bl-full -z-10 opacity-60" />
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block bg-[#004098] text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-full mr-2 mb-1">
                {selectedRest.cuisine}
              </span>
              <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#004098] ${getReactionConfig(selectedRest.id).color} text-[#004098]`}>
                我的反馈: {getReactionConfig(selectedRest.id).text}
              </span>
              <h3 className="text-lg font-black text-black tracking-tight flex items-center gap-1.5 mt-1">
                <span className="text-2xl">{selectedRest.emoji}</span>
                {selectedRest.name}
              </h3>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-0.5 text-black font-mono font-black text-sm bg-[#FBDF04] px-1.5 py-0.5 border border-[#004098] rounded-lg">
                <Star className="w-3.5 h-3.5 fill-current text-orange-500" />
                <span>{selectedRest.rating}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-500 mt-0.5">
                人均 ￥{selectedRest.avgPrice}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-800 leading-relaxed font-semibold mb-3 bg-[#B8EEF0]/30 p-2.5 rounded-xl border border-[#004098]/10 text-[#004098]/90">
            {selectedRest.desc}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-[#004098]/15 pt-3">
            <div className="text-[11px] font-medium text-gray-600">
              <span className="font-bold text-black font-mono">招牌菜:</span> {selectedRest.famousDish}
            </div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
              <span>📍 {selectedRest.distance}m</span>
              <span>⚡ 配送 {selectedRest.deliveryTime}min</span>
            </div>
          </div>

          <div className="mt-3 bg-rose-50 border-2 border-[#004098] p-2.5 rounded-xl text-xs text-[#004098] font-bold flex items-start gap-1.5 shadow-[2.5px_2.5px_0px_#004098]">
            <span className="text-base">💬</span>
            <div className="flex-1 italic leading-relaxed">
              “{selectedRest.memeComment}”
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
