import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Friend, ReactionType, UserStatus, AAPlayer, AACalculatorItem } from '../types';
import { MOCK_RESTAURANTS, MOCK_FRIENDS } from '../restaurantsData';
import { Dices, Sparkles, TrendingUp, Users, Plus, Trash2, Gift, Check, ShieldAlert, Award } from 'lucide-react';

interface TabLunchBuddyProps {
  reactions: Record<string, ReactionType>;
  userStatus: UserStatus;
  onChangeStatus: (status: UserStatus) => void;
  onSelectRestaurant?: (rest: Restaurant) => void;
}

export default function TabLunchBuddy({
  reactions,
  userStatus,
  onChangeStatus,
  onSelectRestaurant
}: TabLunchBuddyProps) {
  // --- Destiny Restaurant State ---
  const [destinyRest, setDestinyRest] = useState<Restaurant | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollType, setRollType] = useState<'dice' | 'tarot' | 'normal'>('normal');
  const [rollStatusText, setRollStatusText] = useState('');

  // --- AA Calculator State ---
  const [players, setPlayers] = useState<AAPlayer[]>([
    { id: 'p-1', name: '我 (Intern)', items: [{ id: 'item-1', name: '地狱拉面', price: 42 }] },
    { id: 'p-2', name: '小林', items: [{ id: 'item-2', name: '重组螺蛳粉', price: 35 }] },
    { id: 'p-3', name: '陈不卷', items: [{ id: 'item-3', name: '爆汁和牛堡', price: 85 }] }
  ]);
  const [discount, setDiscount] = useState<number>(15); // absolute value in RMB (红包/优惠)
  const [newPlayerName, setNewPlayerName] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState<string>('');
  const [activePlayerForAdd, setActivePlayerForAdd] = useState<string>('p-1');

  // Load appropriate Initial Destiny Restaurant based on preferences
  useEffect(() => {
    recalculateDestiny(userStatus, false);
  }, [reactions, userStatus]);

  const loadingTexts = [
    '正在对齐饭搭子口味颗粒度...',
    '正在统计昨晚复兴SOHO研发组加班数据...',
    '午餐占卜屋正联系美食塔罗神明...',
    '正在计算最低降本增效卡路里闭环...',
    '正在排除高排队风险低饱腹度选项...',
    '正在拉取阿里系/字节系实习生食堂外卖大数据...'
  ];

  // Logic to roll/recalculate destiny restaurant
  const recalculateDestiny = (status: UserStatus, animate = true, type: 'dice' | 'tarot' | 'normal' = 'normal') => {
    setIsRolling(true);
    setRollType(type);

    let textIdx = 0;
    setRollStatusText(loadingTexts[0]);

    const textInterval = setInterval(() => {
      textIdx = (textIdx + 1) % loadingTexts.length;
      setRollStatusText(loadingTexts[textIdx]);
    }, 450);

    // Filter restaurants based on user status
    let candidates = [...MOCK_RESTAURANTS];

    if (status === 'spicy') {
      candidates = candidates.filter(r => r.cuisine.includes('川') || r.cuisine.includes('粉面') || r.name.includes('辣') || reactions[r.id] === 'superb');
    } else if (status === 'clear') {
      candidates = candidates.filter(r => r.cuisine.includes('轻食') || r.cuisine.includes('汤') || r.cuisine.includes('咖') || r.avgPrice > 40);
    } else if (status === 'no_queue') {
      candidates = candidates.filter(r => r.distance <= 400 || r.avgPrice <= 35 || r.name.includes('萨莉亚') || r.name.includes('拼盘'));
    }

    // fallback if candidate is empty
    if (candidates.length === 0) candidates = MOCK_RESTAURANTS;

    // Pick top candidates favoring user's positive swipes (superb / ok / want_to_try)
    const favoriteCandidates = candidates.filter(r => 
      reactions[r.id] === 'superb' || reactions[r.id] === 'want_to_try' || reactions[r.id] === 'ok'
    );

    const pool = favoriteCandidates.length > 0 ? favoriteCandidates : candidates;
    const randomPicked = pool[Math.floor(Math.random() * pool.length)] || MOCK_RESTAURANTS[0];

    const duration = animate ? 2000 : 0;

    setTimeout(() => {
      clearInterval(textInterval);
      setDestinyRest(randomPicked);
      setIsRolling(false);
    }, duration);
  };

  // --- AA 計算 ---
  const calculateAA = () => {
    const playerTotals = players.map(p => {
      const sum = p.items.reduce((acc, item) => acc + item.price, 0);
      return { id: p.id, name: p.name, rawSum: sum };
    });

    const grandRawTotal = playerTotals.reduce((acc, p) => acc + p.rawSum, 0);
    
    // discount calculations
    const finalTotals = playerTotals.map(p => {
      if (grandRawTotal === 0) return { ...p, finalSum: 0 };
      const ratio = p.rawSum / grandRawTotal;
      const shareOfDiscount = discount * ratio;
      const finalPrice = Math.max(0, parseFloat((p.rawSum - shareOfDiscount).toFixed(1)));
      return { ...p, finalSum: finalPrice };
    });

    const netPaid = finalTotals.reduce((acc, p) => acc + p.finalSum, 0);

    return {
      grandRawTotal,
      discountedTotal: Math.max(0, parseFloat((grandRawTotal - discount).toFixed(1))),
      breakdown: finalTotals
    };
  };

  const aaResults = calculateAA();

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newId = `player-${Date.now()}`;
    setPlayers(prev => [
      ...prev,
      { id: newId, name: newPlayerName.trim(), items: [] }
    ]);
    setActivePlayerForAdd(newId);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 1) return; // keep at least one
    setPlayers(prev => prev.filter(p => p.id !== id));
    if (activePlayerForAdd === id) {
      setActivePlayerForAdd(players.find(p => p.id !== id)?.id || '');
    }
  };

  const handleAddItemToPlayer = () => {
    const price = parseFloat(customItemPrice);
    if (!customItemName.trim() || isNaN(price) || price < 0) return;

    setPlayers(prev => prev.map(p => {
      if (p.id === activePlayerForAdd) {
        return {
          ...p,
          items: [...p.items, { id: `item-${Date.now()}`, name: customItemName.trim(), price }]
        };
      }
      return p;
    }));

    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleRemoveItem = (playerId: string, itemId: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          items: p.items.filter(item => item.id !== itemId)
        };
      }
      return p;
    }));
  };

  // --- Common Cravings Logic ---
  // Returns restaurant that both user and mock buddies reacted positively to
  const getCommonCravings = () => {
    const cravings: { rest: Restaurant; buddies: Friend[]; tier: '💥 夯爆' | '😋 能吃' | '🆗 还行' }[] = [];

    MOCK_RESTAURANTS.forEach(rest => {
      const userRating = reactions[rest.id];
      const ratedPositiveByUser = userRating === 'superb' || userRating === 'ok' || userRating === 'want_to_try';

      if (ratedPositiveByUser) {
        // find friends who have this restaurant in their favoriteRestaurantIds
        const likingBuddies = MOCK_FRIENDS.filter(friend => 
          friend.favoriteRestaurantIds.includes(rest.id)
        );

        if (likingBuddies.length > 0) {
          let tier: '💥 夯爆' | '😋 能吃' | '🆗 还行' = '🆗 还行';
          if (userRating === 'superb') {
            tier = '💥 夯爆';
          } else if (userRating === 'want_to_try') {
            tier = '😋 能吃';
          }

          cravings.push({
            rest,
            buddies: likingBuddies,
            tier
          });
        }
      }
    });

    return cravings.slice(0, 3); // show top 3
  };

  const commonCravings = getCommonCravings();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Header with dynamic location and active mood selector */}
      <div className="bg-white border-4 border-[#004098] p-4 rounded-3xl shadow-[5px_5px_0px_#004098] relative overflow-hidden">
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#FBDF04] rounded-full border-3 border-[#004098] -z-10" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-[#004098]/70 flex items-center gap-1.5">
              📍 办公地点: <span className="text-[#004098] bg-[#B8EEF0] px-2 py-0.5 rounded border border-[#004098] font-bold">复兴 SOHO</span>
            </span>
            <span className="text-xl">🎒</span>
          </div>

          <h2 className="text-2xl font-black text-[#004098] tracking-tight">
            今天中午吃什么？
          </h2>

          <div className="border-t-2 border-[#004098]/15 mt-2 pt-2">
            <p className="text-[11px] font-black text-gray-500 mb-1.5 uppercase tracking-wider">
              🍔 今日午饭情绪状态 tags:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'clear', label: '清淡健康 🌿', color: 'bg-emerald-300 hover:bg-emerald-400' },
                { id: 'spicy', label: '重口沸腾 🌶️', color: 'bg-rose-300 hover:bg-rose-400' },
                { id: 'no_queue', label: '不想排队 ⚡', color: 'bg-[#B8EEF0] hover:bg-sky-200' }
              ].map((btn) => {
                const isActive = userStatus === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => onChangeStatus(btn.id as UserStatus)}
                    className={`px-2 py-1.5 border-2 border-[#004098] rounded-xl text-center text-xs font-black transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#004098] text-white scale-105 shadow-[2px_2px_0px_#004098]' 
                        : 'bg-white hover:bg-slate-50 text-[#004098] shadow-[1.5px_1.5px_0px_#004098]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Destiny Restaurant Module Container */}
      <div className="bg-white border-4 border-[#004098] p-5 rounded-3xl shadow-[5px_5px_0px_#004098] relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-black text-black flex items-center gap-1.5">
            <span className="text-xl">🎲</span>今日命运餐厅
          </h3>
          <span className="bg-[#FBDF04] text-[9px] font-mono font-black px-2 py-0.5 rounded border border-[#004098] text-[#004098] uppercase">
            Taste Map Engine
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center bg-[#004098] rounded-2xl border-2 border-[#004098]"
            >
              <Dices className="w-12 h-12 text-[#FBDF04] animate-spin mb-4" />
              <div className="text-xs font-mono font-black text-amber-300 animate-pulse px-4">
                {rollStatusText}
              </div>
            </motion.div>
          ) : destinyRest ? (
            <motion.div
              key="rest-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-[#004098] p-4 rounded-2xl bg-amber-50/40 relative overflow-hidden"
            >
              {/* Star highlight tag based on rating */}
              <div className="absolute top-2 right-2 bg-rose-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full border border-[#004098] leading-none flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                推荐指数 SSR
              </div>

              <div className="flex items-start gap-3 mb-2.5">
                <span className="text-4xl filter drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.4)] block select-none">
                  {destinyRest.emoji}
                </span>
                <div>
                  <h4 className="font-black text-base text-black flex items-center gap-1.5">
                    {destinyRest.name}
                  </h4>
                  <div className="flex gap-2 items-center text-[10px] text-gray-500 font-bold mt-0.5">
                    <span className="bg-white border border-[#004098] rounded px-1.5 py-0.2 text-[#004098]">
                      {destinyRest.cuisine}
                    </span>
                    <span>人均: ￥{destinyRest.avgPrice}</span>
                    <span>📍 {destinyRest.distance}m</span>
                  </div>
                </div>
              </div>

              {/* Meme descriptive text block */}
              <p className="text-xs text-gray-800 leading-relaxed font-bold border-l-3 border-[#004098] pl-2 mb-3">
                “{destinyRest.desc}”
              </p>

              {/* Action indicators inside card */}
              <div className="flex justify-between items-center bg-white border border-[#004098] p-2 rounded-xl text-[10px]">
                <div>
                  <span className="font-bold text-black">必点招牌:</span>{' '}
                  <span className="text-orange-600 font-black">{destinyRest.famousDish}</span>
                </div>
                <button
                  onClick={() => onSelectRestaurant && onSelectRestaurant(destinyRest)}
                  className="text-[9px] font-mono font-black text-[#004098] hover:underline cursor-pointer"
                >
                  去地图看看 ➔
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">
              完成口味标定后，解锁命运餐车
            </div>
          )}
        </AnimatePresence>

        {/* Dice roll & tarot triggers */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => recalculateDestiny(userStatus, true, 'dice')}
            className="py-2.5 px-3 bg-[#FBDF04] border-2 border-[#004098] rounded-2xl text-xs font-black text-black shadow-[3px_3px_0px_#004098] hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-black animate-bounce" />
            摇颗骰子推荐 🎲
          </button>
          <button
            onClick={() => recalculateDestiny(userStatus, true, 'tarot')}
            className="py-2.5 px-3 bg-[#FCF0D3] border-2 border-[#004098] rounded-2xl text-xs font-black text-black shadow-[3px_3px_0px_#004098] hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            午餐塔罗解牌 🔮
          </button>
        </div>
      </div>

      {/* 3. Common Cravings Module */}
      <div className="bg-white border-4 border-[#004098] p-5 rounded-3xl shadow-[5px_5px_0px_#004098]">
        <h3 className="text-lg font-black text-black mb-3 flex items-center gap-1.5">
          <Users className="w-5 h-5 text-[#FCA836]" />
          共同想吃（美食默契度）
        </h3>
        <p className="text-[10px] text-gray-500 font-bold mb-3">
          基于你和同事/饭搭子的高频评价，推荐下面这几家契合度最高的餐厅：
        </p>

        <div className="flex flex-col gap-3">
          {commonCravings.length > 0 ? (
            commonCravings.map(({ rest, buddies, tier }) => (
              <div 
                key={rest.id}
                className="flex justify-between items-center p-3 border-2 border-[#004098] rounded-2xl bg-[#B8EEF0]/15 hover:bg-[#B8EEF0]/25 transition-colors cursor-pointer"
                onClick={() => onSelectRestaurant && onSelectRestaurant(rest)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{rest.emoji}</span>
                  <div>
                    <h4 className="font-black text-xs text-black leading-tight">
                      {rest.name}
                    </h4>
                    <p className="text-[9px] font-mono text-[#004098]/60 mt-1">
                      距离 {rest.distance}m · 人均 ￥{rest.avgPrice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="bg-[#004098] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
                    {tier}
                  </span>
                  {/* Coworker faces row */}
                  <div className="flex -space-x-1.5">
                    {buddies.map(friend => (
                      <span 
                        key={friend.id} 
                        className="w-5.5 h-5.5 rounded-full border border-[#004098] bg-white flex items-center justify-center text-[10px] shadow-[1px_1px_0px_#004098] pointer-events-auto"
                        title={`${friend.name} 也喜欢`}
                      >
                        {friend.avatar}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs font-bold text-gray-400 bg-slate-50 rounded-xl border border-dashed border-gray-200">
              暂无匹配的同好倾向，多探索几个餐厅会有哦！
            </div>
          )}
        </div>
      </div>

      {/* 4. AA Split Bill Game Tool */}
      <div className="bg-white border-4 border-[#004098] p-5 rounded-3xl shadow-[5px_5px_0px_#004098] relative">
        <div className="absolute top-2 right-2 bg-[#FCA836] text-black font-mono text-[8px] font-black px-2 py-0.5 border border-[#004098] rounded-l-md rounded-r-none transform rotate-2">
          AA MINI-GAME
        </div>

        <h3 className="text-l font-black text-black mb-1 flex items-center gap-1.5">
          <span className="text-xl">📊</span>
          AA 分账算账游戏助手
        </h3>
        <p className="text-[10px] text-gray-500 font-bold mb-4">
          不用繁复表格！输入开销及红包折扣，立即算出每位好友该给多少。
        </p>

        {/* Players billing layout */}
        <div className="flex flex-col gap-3.5 mb-4">
          {players.map((p) => (
            <div key={p.id} className="border-2 border-[#004098] p-3.5 rounded-2xl bg-slate-50 relative">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-extrabold text-xs text-[#004098] flex items-center gap-1">
                  <span>👤</span> {p.name}
                </span>
                {players.length > 2 && (
                  <button
                    onClick={() => handleRemovePlayer(p.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Items in player cart */}
              <div className="flex flex-col gap-1.5">
                {p.items.length > 0 ? (
                  p.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px] bg-white border border-[#004098]/10 px-2 py-1 rounded-lg">
                      <span className="text-gray-700 font-bold">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#004098]">￥{item.price}</span>
                        <button
                          onClick={() => handleRemoveItem(p.id, item.id)}
                          className="text-gray-400 hover:text-rose-500 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] italic text-gray-400 block py-1">还没点单，快帮他加菜 🥢</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick presets & additions */}
        <div className="border-t-2 border-dashed border-[#004098]/10 pt-3 flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="新好友姓名..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border-2 border-[#004098] rounded-xl focus:outline-none"
            />
            <button
              onClick={handleAddPlayer}
              className="px-3 bg-[#B8EEF0] border-2 border-[#004098] rounded-xl text-xs font-black shadow-[2px_2px_0px_#004098] active:scale-95 text-[#004098] cursor-pointer"
            >
              加人 👤
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-yellow-50/50 p-2.5 rounded-2xl border-2 border-[#004098]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#004098]">给谁加单:</label>
              <select
                value={activePlayerForAdd}
                onChange={(e) => setActivePlayerForAdd(e.target.value)}
                className="px-2 py-1.5 text-xs border-2 border-[#004098] rounded-xl bg-white font-bold"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#004098]">开销项目和金额:</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="如:面条"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-18 px-1.5 py-1 text-xs border border-gray-400 rounded bg-white text-[10px]"
                />
                <input
                  type="number"
                  placeholder="元"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  className="w-12 px-1.5 py-1 text-xs border border-gray-400 rounded bg-white text-[10px]"
                />
                <button
                  onClick={handleAddItemToPlayer}
                  className="bg-[#004098] text-[#FBDF04] rounded p-1 cursor-pointer hover:bg-opacity-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick preset food items click triggers */}
          <div>
            <span className="text-[9px] font-black text-gray-500 mr-2 block mb-1">🎯 快捷添加大厂优惠预置美食:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: '地狱面', price: 42 },
                { name: '螺蛳粉', price: 35 },
                { name: '和牛堡', price: 85 },
                { name: '潮汕牛肉汤', price: 45 },
                { name: '精品木桶饭', price: 22 }
              ].map((food) => (
                <button
                  key={food.name}
                  onClick={() => {
                    setPlayers(prev => prev.map(p => {
                      if (p.id === activePlayerForAdd) {
                        return {
                          ...p,
                          items: [...p.items, { id: `preset-${Date.now()}`, name: food.name, price: food.price }]
                        };
                      }
                      return p;
                    }));
                  }}
                  className="bg-white border-2 border-[#004098]/30 hover:border-[#004098] rounded-lg px-2 py-0.5 text-[9px] font-bold cursor-pointer transition-all"
                >
                  +{food.name} (￥{food.price})
                </button>
              ))}
            </div>
          </div>

          {/* Discount / Red Envelope input control */}
          <div className="bg-rose-50 border-2 border-[#004098] p-3 rounded-2xl flex items-center justify-between mt-1">
            <span className="text-xs font-black text-[#004098] flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-rose-500 animate-bounce" />
              减免红包/促销优惠:
            </span>
            <div className="flex items-center gap-1 font-mono font-black">
              <span>- ￥</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-1.5 py-1 text-xs border-2 border-[#004098] rounded bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Final AA Bill calculation report block */}
          <div className="bg-[#004098] text-white p-4 rounded-2xl border-2 border-[#004098] mt-1 shadow-[4px_4px_0px_#FBDF04]">
            <div className="flex justify-between items-center text-xs font-mono mb-2 border-b border-white/20 pb-1.5">
              <span>总额: ￥{aaResults.grandRawTotal}</span>
              <span className="text-[#FBDF04] font-black">实付总额: ￥{aaResults.discountedTotal}</span>
            </div>

            <div className="flex flex-col gap-2">
              {aaResults.breakdown.map((r) => (
                <div key={r.id} className="flex justify-between text-xs items-center">
                  <span className="font-bold flex items-center gap-1">
                    <span className="text-[10px]">💰</span> {r.name}
                  </span>
                  <div className="font-mono text-sm">
                    <span className="text-[10px] text-slate-350 mr-2">折前 ￥{r.rawSum}</span>
                    <span className="text-[#B8EEF0] font-black">付款: ￥{r.finalSum}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
