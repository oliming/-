import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, ReactionType } from '../types';
import { Sparkles, Star, Flame, Sparkle, Trophy, Share2, Users, Utensils, Shield, Check, Copy } from 'lucide-react';

interface SwipeStageProps {
  restaurants: Restaurant[];
  onFinish: (reactions: Record<string, ReactionType>) => void;
}

interface PersonalityType {
  name: string;
  emoji: string;
  tagline: string;
  bannerColor: string;
  textColor: string;
}

const PERSONALITIES: Record<string, PersonalityType> = {
  efficiency: {
    name: '效率型碳水补给员 🍛',
    emoji: '🕒',
    tagline: '“一切不以吃饱为目的的午饭都是耍流氓！3分钟搞定，下午继续买单！”',
    bannerColor: 'bg-[#B8EEF0]',
    textColor: 'text-[#004098]',
  },
  heavy: {
    name: '重口快乐执行者 🌶️',
    emoji: '🔥',
    tagline: '“唯有猛油重辣、螺蛳粉的深度芬芳，才能唤醒我下午昏昏欲睡的大脑！”',
    bannerColor: 'bg-[#FBDF04]',
    textColor: 'text-[#004098]',
  },
  explorer: {
    name: '探索型午餐玩家 🍔',
    emoji: '🎒',
    tagline: '“每天吃一样的午饭简直是生命虚度？走，今天必须去打卡排队爆款！”',
    bannerColor: 'bg-[#FCF0D3]',
    textColor: 'text-orange-850',
  },
  stable: {
    name: '稳定派不踩雷选手 🥗',
    emoji: '🛡️',
    tagline: '“维持现有胃部生态就是午间最佳架构，贝果和潮汕丸子汤最温柔懂我。”',
    bannerColor: 'bg-[#E1F3D8]',
    textColor: 'text-green-800',
  }
};

export default function SwipeStage({ restaurants, onFinish }: SwipeStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<string, ReactionType>>({});
  const [showResult, setShowResult] = useState(false);
  const [assignedPersonality, setAssignedPersonality] = useState<string>('efficiency');
  const [shareTips, setShareTips] = useState<string | null>(null);
  const [matchCode, setMatchCode] = useState<string>('');
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const currentRest = restaurants[currentIndex];

  const handleRate = (type: ReactionType) => {
    if (!currentRest) return;
    
    const updated = { ...reactions, [currentRest.id]: type };
    setReactions(updated);

    if (currentIndex === restaurants.length - 1) {
      // Completed last one! Calculate lunch personality first
      calculatePersonality(updated);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const calculatePersonality = (finalReactions: Record<string, ReactionType>) => {
    let heavyCount = 0; // rest-1, rest-2, rest-6
    let configCount = 0; // rest-3, rest-7, rest-12 (healthy/stable)
    let exploreCount = 0; // rest-5, rest-11 (premium/explorer)
    let effCount = 0; // rest-4, rest-8, rest-10 (cheap/fast)

    Object.entries(finalReactions).forEach(([restId, reaction]) => {
      const isPositive = reaction === 'superb' || reaction === 'ok' || reaction === 'want_to_try';
      if (!isPositive) return;

      if (['rest-1', 'rest-2', 'rest-6'].includes(restId)) heavyCount++;
      if (['rest-3', 'rest-7', 'rest-12'].includes(restId)) configCount++;
      if (['rest-5', 'rest-11'].includes(restId)) exploreCount++;
      if (['rest-4', 'rest-8', 'rest-10'].includes(restId)) effCount++;
    });

    // Determine highest score
    const max = Math.max(heavyCount, configCount, exploreCount, effCount);
    let result: string = 'efficiency';
    
    if (max === heavyCount && heavyCount > 0) result = 'heavy';
    else if (max === exploreCount && exploreCount > 0) result = 'explorer';
    else if (max === configCount && configCount > 0) result = 'stable';
    else if (max === effCount && effCount > 0) result = 'efficiency';
    else {
      // tie or no positive, randomize
      const keys = ['efficiency', 'heavy', 'explorer', 'stable'];
      result = keys[Math.floor(Math.random() * keys.length)];
    }

    setAssignedPersonality(result);
    setShowResult(true);
  };

  const handleQuickComplete = () => {
    const finalReactions: Record<string, ReactionType> = {};
    const reactTypes: ReactionType[] = ['superb', 'ok', 'fine', 'bad', 'want_to_try', 'no_interest'];
    
    restaurants.forEach((rest, idx) => {
      // randomize opinions
      const react = reactTypes[(idx + 2) % reactTypes.length];
      finalReactions[rest.id] = react;
    });

    setReactions(finalReactions);
    calculatePersonality(finalReactions);
  };

  const currentPersonality = PERSONALITIES[assignedPersonality];
  const progressPercentage = Math.round((currentIndex / restaurants.length) * 100);

  const handleShare = () => {
    const text = `🎉【饭搭子口味测评】我生成了我的「${currentPersonality.name}」午饭人格！办公地点：复兴SOHO。我的吃货神code是: #FDZ-${assignedPersonality.toUpperCase()}-2026！快来看看你和我是不是一类饭友！`;
    navigator.clipboard.writeText(text);
    setShareTips('📋 测评链接及吃货神Code已复制！发送给微信/小红书好友即可分享！');
    setTimeout(() => setShareTips(null), 4000);
  };

  const handleCompareMatch = () => {
    if (!matchCode.trim()) {
      alert('请输入你搭子的吃货神Code（如 stable, heavy, explorer）');
      return;
    }
    const code = matchCode.toLowerCase().trim();
    if (code.includes('stable') || code === 'stable') {
      setMatchResult('💚 默契指数 85%！对方是稳定清淡党，适合周一跟他去喝温暖美味的汤品，调理肠胃。');
    } else if (code.includes('heavy') || code === 'heavy') {
      setMatchResult('🔥 螺蛳粉警报！默契指数 60%！对方是个螺蛳粉/重组肉脑，想带你去吃变态辣拉面。请做好准备！');
    } else if (code.includes('explorer') || code === 'explorer') {
      setMatchResult('🎒 探店大师！默契指数 95%！你们是复兴SOHO完美的黄金搭档，一个敢带跑，一个敢大排长龙！');
    } else if (code.includes('efficiency') || code === 'efficiency') {
      setMatchResult('🍚 效率大师！默契指数 70%！他吃饭只需要3分钟。下午2点有会时喊他必保准不迟到！');
    } else {
      setMatchResult('🎲 神秘饭友！默契指数 50%。你们可以抛个色子决定今天中午去萨莉亚还是火山和牛！');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 px-1 py-1">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="onboarding-questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Intro Header */}
            <div className="text-center">
              <div className="inline-block bg-white border-2 border-[#004098] px-3 py-1 rounded-full text-xs font-black text-[#004098] shadow-[3px_3px_0px_#004098] mb-2">
                🚀 场景: 复兴 SOHO 周边 1KM (配送 40min 圈)
              </div>
              <h1 className="text-3xl font-black text-[#004098] tracking-tight drop-shadow-[2.5px_2.5px_0px_#FBDF04]">
                口味标定·初试 🍜
              </h1>
              <p className="text-xs text-slate-700 mt-2 font-black leading-normal">
                点击按钮反馈喜好，建立你的 <span className="text-orange-600 underline decoration-2">Taste Profile</span>
              </p>
            </div>

            {/* Progress Vibe Bar */}
            <div className="bg-white border-3 border-[#004098] p-2.5 rounded-2xl shadow-[4px_4px_0px_#004098]">
              <div className="flex justify-between items-center text-xs font-black text-[#004098] mb-1.5 px-0.5">
                <span>🎯 偏好度建模进度</span>
                <span>{currentIndex + 1} / {restaurants.length} 家 </span>
              </div>
              <div className="w-full h-4 bg-[#B8EEF0] border-2 border-[#004098] rounded-lg overflow-hidden relative">
                <motion.div 
                  className="h-full bg-[#FCA836] border-r-2 border-[#004098]" 
                  id="progress-indicator-bar"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 85 }}
                />
              </div>
            </div>

            {/* Dynamic Card Container for Choice Rating (No Dragging/Swipe) */}
            {currentRest && (
              <motion.div
                key={currentRest.id}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -15 }}
                transition={{ type: 'spring', damping: 22, stiffness: 140 }}
                className="w-full bg-white border-4 border-[#004098] rounded-3xl p-5 shadow-[8px_8px_0px_#004098] flex flex-col justify-between overflow-hidden relative"
              >
                {/* Upper Cuisine Tag */}
                <div className="absolute top-0 right-0 bg-[#B8EEF0] text-[#004098] font-mono text-[9px] font-black border-l-3 border-b-3 border-[#004098] px-3 py-1.5 uppercase tracking-tight z-10 shadow-[1px_1.5px_0px_#004098]">
                  {currentRest.cuisine}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] select-none">
                      {currentRest.emoji}
                    </span>
                    <div>
                      <h2 className="text-xl font-black text-black tracking-tight leading-none">
                        {currentRest.name}
                      </h2>
                      <div className="flex gap-2 items-center mt-2.5">
                        <span className="bg-[#FBDF04] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#004098] text-black">
                          ￥{currentRest.avgPrice} /人
                        </span>
                        <span className="text-[10px] text-gray-500 font-extrabold">
                          📍 {currentRest.distance}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 bg-yellow-50/60 border-2 border-[#004098]/30 rounded-2xl p-3.5">
                    <p className="text-xs text-gray-800 leading-relaxed font-bold">
                      &ldquo;{currentRest.desc}&rdquo;
                    </p>
                  </div>

                  {/* 招牌菜 MUST exhibit 3 dishes based on specification */}
                  <div className="mt-2.5 pt-2.5 border-t-2 border-dashed border-[#004098]/15">
                    <p className="text-[10px] font-black text-slate-500 mb-2 tracking-wider uppercase flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-[#FCA836]" /> ⭐ 3大必点特色招牌菜 (Signature Dishes)
                    </p>
                    <div className="flex flex-col gap-1.5 w-full">
                      {(currentRest.famousDishes || []).map((dish, i) => (
                        <div 
                          key={i} 
                          className="bg-[#B8EEF0]/30 border-2 border-[#004098] text-slate-800 text-[10.5px] font-black px-3 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_#004098] leading-tight flex items-center gap-1.5"
                        >
                          <span className="text-amber-500 text-xs">⭐</span>
                          <span>{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meme comments section inside card */}
                <div className="mt-4 bg-orange-50 border-2 border-dashed border-[#FCA836] p-2.5 rounded-xl text-[11px] text-[#004098] font-semibold italic flex gap-1.5 items-center">
                  <span className="text-base select-none">💬</span>
                  <p>&ldquo;{currentRest.memeComment}&rdquo;</p>
                </div>
              </motion.div>
            )}

            {/* 4 Click Evaluation Buttons (Click to Rate) */}
            <div className="bg-white border-4 border-[#004098] p-4.5 rounded-3xl shadow-[5px_5.5px_0px_#004098] flex flex-col gap-3.5">
              <span className="text-center text-[11px] font-black text-[#004098]/70 tracking-widest uppercase flex items-center justify-center gap-1 border-b pb-2">
                <Sparkle className="w-3.5 h-3.5 text-yellow-500 animate-spin" /> 给予真实反馈构建口味向量
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRate('superb')}
                  className="py-3 px-2 bg-[#FCA836] hover:scale-103 active:scale-97 text-black font-black border-2 border-[#004098] rounded-xl text-xs shadow-[3px_3.5px_0px_#004098] cursor-pointer transition-transform flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">👍</span> 夯爆了
                </button>
                <button
                  onClick={() => handleRate('ok')}
                  className="py-3 px-2 bg-[#FBDF04] hover:scale-103 active:scale-97 text-black font-black border-2 border-[#004098] rounded-xl text-xs shadow-[3px_3.5px_0px_#004098] cursor-pointer transition-transform flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">🙂</span> 还不错
                </button>
                <button
                  onClick={() => handleRate('fine')}
                  className="py-3 px-2 bg-emerald-100 hover:scale-103 active:scale-97 text-emerald-950 font-black border-2 border-[#004098] rounded-xl text-xs shadow-[3px_3.5px_0px_#004098] cursor-pointer transition-transform flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">😐</span> 一般
                </button>
                <button
                  onClick={() => handleRate('bad')}
                  className="py-3 px-2 bg-rose-100 hover:scale-103 active:scale-97 text-rose-950 font-black border-2 border-[#004098] rounded-xl text-xs shadow-[3px_3.5px_0px_#004098] cursor-pointer transition-transform flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">👎</span> 好难吃
                </button>
              </div>

              {/* 2 Auxiliary Action buttons underneath */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-dashed border-[#004098]/15 pt-3">
                <button
                  onClick={() => handleRate('want_to_try')}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 border-2 border-dashed border-[#004098] text-[#004098] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="text-xs">➕</span> 想尝试
                </button>
                <button
                  onClick={() => handleRate('no_interest')}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 border-2 border-dashed border-gray-400 text-gray-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="text-xs">❌</span> 没兴趣
                </button>
              </div>
            </div>

            {/* Bypass complete action */}
            <button
              onClick={handleQuickComplete}
              className="text-[11px] text-gray-500 hover:text-black font-black uppercase transition-colors text-center font-mono py-1 underline cursor-pointer"
            >
              ⚡ 一键测评（快速分析我的味觉人格进入 App）
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="onboarding-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5"
          >
            {/* Success Animation Shield */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#FBDF04] border-4 border-[#004098] flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-8 h-8 text-[#004098]" />
              </div>
              <p className="text-[10px] font-mono font-black text-[#004098] uppercase tracking-widest">
                TASTE PROFILE LOCKED
              </p>
              <h2 className="text-2xl font-black text-[#004098] tracking-tight mt-1">
                你的吃饭人格 🏆
              </h2>
            </div>

            {/* Playful Personality Card Block */}
            <div className="bg-white border-4 border-[#004098] rounded-3xl overflow-hidden shadow-[7px_7px_0px_#004098] transition-all">
              {/* Type banner */}
              <div className={`p-4 border-b-4 border-[#004098] ${currentPersonality.bannerColor} text-[#004098] flex items-center justify-between`}>
                <div>
                  <span className="text-xs font-black uppercase text-[#004098]/70">
                    你的大厂饭格
                  </span>
                  <h3 className="text-xl font-black text-[#004098] mt-0.5">
                    {currentPersonality.name}
                  </h3>
                </div>
                <span className="text-5xl">{currentPersonality.emoji}</span>
              </div>

              {/* Tagline details */}
              <div className="p-5 flex flex-col gap-4">
                <div className="text-xs font-bold leading-relaxed italic bg-amber-50 rounded-xl p-3 border-2 border-[#004098]/10 text-slate-800">
                  {currentPersonality.tagline}
                </div>
              </div>
            </div>

            {/* CTA Option Grid */}
            <div className="flex flex-col gap-3">
              {shareTips && (
                <div className="bg-emerald-50 border-2 border-green-500 text-green-800 text-xs font-black p-3 rounded-xl text-center">
                  {shareTips}
                </div>
              )}
              
              <button
                onClick={handleShare}
                className="py-3 px-4 bg-white hover:bg-slate-50 hover:scale-102 active:scale-98 border-3 border-[#004098] rounded-2xl text-xs font-black text-[#004098] shadow-[4px_4.5px_0px_#004098] transition-all flex items-center justify-center gap-2.5 cursor-pointer w-full"
              >
                <Share2 className="w-5.5 h-5.5 text-amber-500" />
                <span>分享给同组饭搭子，看看是不是同类 🎁</span>
              </button>

              <button
                onClick={() => onFinish(reactions)}
                id="enter-app-cta-btn"
                className="py-3.5 px-4 bg-[#004098] hover:bg-opacity-95 hover:scale-102 active:scale-98 border-3 border-[#004098] rounded-2xl text-sm font-black text-[#FBDF04] shadow-[4px_4.5px_0px_#FBDF04] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                进入饭搭子大厅，开启约拼！➔
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
